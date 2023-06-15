import { autowired } from "@/di";
import { XRelation, XTarget } from "@/lib/base/schema";
import RelationModel from "./RelationModel";
import { schema } from "@/lib/base";
import KernelApi from "@/lib/api/kernelapi";
import { OperateType, TargetType } from "@/lib/base/enums";
import relationTypes from "@/lib/domain/target/relation/relationTypes";
import getRelationTypes from "@/lib/domain/target/relation/relationTypes";
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
   * @param targetId
   * @param teamIds
   */
  generateRelations(targetId: string, teamIds: string[]): void {
    let relations = teamIds.map((teamId) => {
      return { targetId: targetId, teamId: teamId } as XRelation;
    });
    this.relations.insertBatch(relations);
  }

  /**
   * 断开关系
   * @param targetId
   * @param teamId
   */
  breakRelations(targetId: string, teamId: string): void {
    this.relations.removeByKey(targetId, teamId);
  }

  /**
   * 拉入人员
   * @param team
   * @param members
   * @param notify
   * @returns
   */
  async pullMembers(team: XTarget, members: schema.XTarget[]) {
    let memberTypes = getRelationTypes(team.typeName as TargetType);
    members = members
      .filter((i) => memberTypes.includes(i.typeName as TargetType))
      .filter((i) => this.relations.has(team.id, i.id));
    if (members.length > 0) {
      let memberIds = members.map((i) => i.id);
      const res = await this.kernel.pullAnyToTeam({
        id: team.id,
        subIds: memberIds,
      });
      if (res.success) {
        this.generateRelations(team.id, memberIds);
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
