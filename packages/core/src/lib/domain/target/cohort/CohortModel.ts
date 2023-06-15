import { XTarget } from "@/lib/base/schema";
import { CollectionImpl } from "@/lib/model/ModelContext";
import RelationModel from "../relation/RelationModel";
import { autowired } from "@/di";
import { TargetType } from "@/lib/base/enums";

export default class CohortModel extends CollectionImpl<XTarget> {
  @autowired(RelationModel)
  private readonly relationModel: RelationModel = null!;

  get cohorts(): XTarget[] {
    return this.collection;
  }

  getCohortsByTargetId(targetId: string): XTarget[] {
    let teamIds = this.relationModel.getTeamIdsByTargetId(targetId);
    return this.collection
      .filter((item) => teamIds.indexOf(item.id) != -1)
      .filter((item) => item.typeName == TargetType.Cohort);
  }
}
