import { XTarget } from "@/lib/base/schema";
import { CollectionImpl } from "@/lib/model/ModelContext";
import RelationModel from "../relation/RelationModel";
import { autowired } from "@/di";

export default class CompanyModel extends CollectionImpl<XTarget> {
  @autowired(RelationModel)
  private readonly relationModel: RelationModel = null!;

  get companies(): XTarget[] {
    return this.companies;
  }

  getCompaniesByTargetId(targetId: string): XTarget[] {
    let teamIds = this.relationModel.getTeamIdsByTargetId(targetId);
    return this.collection.filter((team) => teamIds.indexOf(team.id) != -1);
  }

  targets(companyId: string): XTarget[] {
    return [];
  }
}
