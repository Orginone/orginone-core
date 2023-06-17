import { service } from "@/di";
import { XTarget } from "@/lib/base/schema";
import { Repository } from "@/lib/model/ModelContext";
import { StateAction } from "@/state";
import RelationModel, { RelationType } from "../relation/RelationModel";

@service(["StateAction", RelationModel])
export default class CohortModel extends Repository<XTarget> {
  readonly relations: RelationModel;

  constructor(stateAction: StateAction, relations: RelationModel) {
    super(stateAction);
    this.relations = relations;
  }

  get cohorts(): XTarget[] {
    return this.data;
  }

  getCohortsByTargetId(targetId: string): XTarget[] {
    let teamIds = this.relations.getPassiveIdsByActiveId(
      RelationType.Targets,
      targetId
    );
    return this.data.filter((item) => teamIds.indexOf(item.id) != -1);
  }

  removeByTargetId(targetId: string): void {
    let cohorts = this.relations.getPassiveIdsByActiveId(
      RelationType.Targets,
      targetId
    );
    cohorts.forEach((teamId) =>
      this.relations.removeByKey(RelationType.Targets, targetId, teamId)
    );
    this.removeByIds(cohorts);
  }

  targets(cohortId: string): XTarget[] {
    return [];
  }
}
