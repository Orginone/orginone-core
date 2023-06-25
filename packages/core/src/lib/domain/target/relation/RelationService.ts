import { autowired } from "@/di";
import { XTarget } from "@/lib/base/schema";
import RelationModel, { Relation, RelationType } from "./RelationModel";
import { schema } from "@/lib/base";
import KernelApi from "@/lib/api/kernelapi";
import { OperateType, TargetType } from "@/lib/base/enums";
import getTargetRelationTypes from "@/lib/domain/target/relation/relationTypes";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state";
import { PageAll } from "@/lib/base/consts";

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
      return {
        typeName: RelationType.Targets,
        targetId: targetId,
        teamId: teamId,
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
    this.relations.remove(targetId, teamId);
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
    members = members.filter((i) =>
      memberTypes.includes(i.typeName as TargetType)
    );
    if (members.length > 0) {
      let memberIds = members.map((i) => i.id);
      const res = await this.kernel.pullAnyToTeam({
        id: team.id,
        subIds: memberIds,
      });
      if (res.success) {
        this.generateRelations(team.id, memberIds);
      }
      return res.success;
    }
    return true;
  }

  /**
   * 删除成员
   */
  async removeMembers(
    team: XTarget,
    members: schema.XTarget[]
  ): Promise<boolean> {
    let memberTypes = getTargetRelationTypes(team.typeName as TargetType);
    members = members.filter((i) =>
      memberTypes.includes(i.typeName as TargetType)
    );
    for (const member of members) {
      if (memberTypes.includes(member.typeName as TargetType)) {
        const res = await this.kernel.removeOrExitOfTeam({
          id: team.id,
          subId: member.id,
        });
        this.breakRelations(team.id, member.id);
        return res.success;
      }
    }
    return true;
  }
}
