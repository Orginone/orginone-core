import { service } from "@/di";
import { Xbase } from "@/lib/base/schema";
import { Repository, IndexType } from "@/lib/model/ModelContext";
import { StateAction } from "@/state";

export interface Relation extends Xbase {
  targetId: string;
  teamId: string;
  typeName: RelationType;
}

export enum RelationType {
  Targets,
  TargetAuthority,
}

@service(["StateAction"])
export default class RelationModel extends Repository<Relation> {
  constructor(stateAction: StateAction) {
    super(stateAction);
    super.registerIndexing(
      (item: Relation) => this.index(item.targetId, item.teamId),
      IndexType.Unique
    );
  }
  /**
   * 对象/组织索引
   * @param targetId 对象 ID
   * @param teamId 组织 ID
   * @returns
   */
  index(targetId: string, teamId: string): string {
    return targetId + "_" + teamId;
  }
  /**
   * 是否存在对象/组织关系
   * @param targetId 对象
   * @param teamId 组织
   * @returns
   */
  hasRelation(targetId: string, teamId: string): boolean {
    return super.has(this.index(targetId, teamId));
  }
  /**
   * 建立对象/组织关系
   * @param targetId 对象
   * @param teamId 组织
   */
  addTargets(targetId: string, teamId: string) {
    if (!this.hasRelation(targetId, teamId)) {
      this.insert({
        typeName: RelationType.Targets,
        targetId: targetId,
        teamId: teamId,
      } as Relation);
    }
  }
  /**
   * 一处对象/组织关系
   * @param targetId 对象
   * @param teamId 组织
   */
  remove(targetId: string, teamId: string) {
    let index = this.index(targetId, teamId);
    this.removeFirst((item) => index == this.index(item.targetId, item.teamId));
  }
  /**
   * 通过对象寻找到组织关系
   * @param type 关系类型
   * @param targetId 对象
   * @returns
   */
  findTeamIds(type: RelationType, targetId: string): string[] {
    return this.data
      .filter((item) => item.targetId == targetId)
      .filter((item) => item.typeName == type)
      .map((item) => item.teamId);
  }
}
