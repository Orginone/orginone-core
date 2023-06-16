import { XTarget } from "@/lib/base/schema";
import { CollectionImpl } from "@/lib/model/ModelContext";
import RelationModel from "../relation/RelationModel";
import { autowired } from "@/di";

export default class CohortModel extends CollectionImpl<XTarget> {
  @autowired(RelationModel)
  private readonly relations: RelationModel = null!;

  get cohorts(): XTarget[] {
    return this.collection;
  }

  getCohortsByTargetId(targetId: string): XTarget[] {
    let teamIds = this.relations.getTeamIdsByTargetId(targetId);
    return this.collection.filter((item) => teamIds.indexOf(item.id) != -1);
  }

  removeByTargetId(targetId: string): void {
    let cohorts = this.relations.getTeamIdsByTargetId(targetId);
    cohorts.forEach((teamId) => this.relations.removeByKey(targetId, teamId));
    this.removeByIds(cohorts);
  }
}
