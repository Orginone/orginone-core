import { service } from "@/di";
import { XTarget } from "@/lib/base/schema";
import { Repository } from "@/lib/model/ModelContext";
import { StateAction } from "@/state";
import RelationModel, { RelationType } from "../relation/RelationModel";
import { TargetType } from "@/lib/base/enums";
import { companyTypes } from "@/lib/base/consts";

@service(["StateAction", RelationModel])
export default class TargetModel extends Repository<XTarget> {
  readonly relations: RelationModel;

  constructor(stateAction: StateAction, relations: RelationModel) {
    super(stateAction);
    this.relations = relations;
  }

  findCompanies(targetId: string): XTarget[] {
    return this.findTeams(targetId, companyTypes);
  }

  findCohorts(targetId: string): XTarget[] {
    return this.findTeams(targetId, [TargetType.Cohort]);
  }

  findGroups(targetId: string): XTarget[] {
    return this.findTeams(targetId, [TargetType.Group]);
  }

  findTeams(targetId: string, targetTypes: string[]): XTarget[] {
    let teamIds = this.relations.findTeamIds(RelationType.Targets, targetId);
    return this.data
      .filter((team) => targetTypes.indexOf(team.typeName) != -1)
      .filter((team) => teamIds.indexOf(team.id) != -1);
  }
}
