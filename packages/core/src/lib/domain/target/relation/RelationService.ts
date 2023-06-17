import { autowired } from "@/di";
import { XTarget } from "@/lib/base/schema";
import RelationModel, { Relation, RelationType } from "./RelationModel";
import { schema } from "@/lib/base";
import KernelApi from "@/lib/api/kernelapi";
import { OperateType, TargetType } from "@/lib/base/enums";
import getTargetRelationTypes from "@/lib/domain/target/relation/relationTypes";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state";

export default class RelationService {
  @autowired(KernelApi)
  private readonly kernel: KernelApi = null!;

  @autowired("UserStore")
  private readonly userStore: Store<UserStore> = null!;

  @autowired(RelationModel)
  private readonly relations: RelationModel = null!;

  get userId() {
    return this.userStore.currentUser.value.id;
  }

  get user() {
    return this.userStore.currentUser.value;
  }

  /**
   * 建立关系（关系是双向的）
   * @param activeId
   * @param passiveIds
   */
  generateRelations(
    type: RelationType,
    activeId: string,
    passiveIds: string[]
  ): void {
    let relations = passiveIds.map((passiveId) => {
      return {
        typeName: type,
        activeId: activeId,
        passiveId: passiveId,
      } as Relation;
    });
    this.relations.insertBatch(relations);
  }

  /**
   * 断开关系
   * @param targetId
   * @param teamId
   */
  breakRelations(targetId: string, teamId: string): void {
    this.relations.removeByKey(RelationType.Targets, targetId, teamId);
  }

  /**
   * 拉入人员
   * @param team
   * @param members
   * @param notify
   * @returns
   */
  async pullMembers(team: XTarget, members: schema.XTarget[]) {
    let memberTypes = getTargetRelationTypes(team.typeName as TargetType);
    members = members
      .filter((i) => memberTypes.includes(i.typeName as TargetType))
      .filter((i) =>
        this.relations.hasRelation(RelationType.Targets, team.id, i.id)
      );
    if (members.length > 0) {
      let memberIds = members.map((i) => i.id);
      const res = await this.kernel.pullAnyToTeam({
        id: team.id,
        subIds: memberIds,
      });
      if (res.success) {
        this.generateRelations(RelationType.Targets, team.id, memberIds);
        members.forEach((a) => {
          this.createTargetMsg(team, OperateType.Add, a);
        });
      }
      return res.success;
    }
    return true;
  }

  /**
   * 创建组织变更消息
   * @param team
   * @param operate
   * @param sub
   */
  async createTargetMsg(
    team: XTarget,
    operate: OperateType,
    sub?: schema.XTarget
  ): Promise<void> {
    await this.kernel.createTargetMsg({
      targetId: sub && this.userId === team.id ? sub.id : team.id,
      excludeOperater: false,
      group: team.typeName === TargetType.Group,
      data: JSON.stringify({
        operate,
        target: team,
        subTarget: sub,
        operater: this.user,
      }),
    });
  }
}
