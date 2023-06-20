import { service } from "@/di";
import { XTarget } from "@/lib/base/schema";
import { Repository } from "@/lib/model/ModelContext";
import { StateAction } from "@/state";
import RelationModel, { RelationType } from "../relation/RelationModel";

@service(["StateAction", RelationModel])
export default class CompanyModel extends Repository<XTarget> {
  readonly relations: RelationModel;

  constructor(stateAction: StateAction, relations: RelationModel) {
    super(stateAction);
    this.relations = relations;
  }

  getCompaniesByTargetId(targetId: string): XTarget[] {
    let teamIds = this.relations.getPassiveIdsByActiveId(
      RelationType.Targets,
      targetId
    );
    return this.data.filter((team) => teamIds.indexOf(team.id) != -1);
  }

  targets(companyId: string): XTarget[] {
    return [];
  }
}
