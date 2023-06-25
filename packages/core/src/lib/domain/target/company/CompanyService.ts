import { autowired } from "@/di";
import { model } from "@/lib/base";
import { companyTypes } from "@/lib/base/consts";
import { TargetType } from "@/lib/base/enums";
import { XTarget } from "@/lib/base/schema";
import TargetService from "../base/TargetService";
import CohortService from "../cohort/CohortService";
import GroupService from "../group/GroupService";
import RelationService from "../relation/RelationService";

export default class CompanyService extends TargetService {
  @autowired(RelationService)
  readonly groupService: GroupService = null!;

  @autowired(CohortService)
  readonly cohortService: CohortService = null!;

  async loadUserCompanies(): Promise<XTarget[]> {
    return await super.loadTeam(this.userId, companyTypes);
  }

  async createCompany(data: model.TargetModel): Promise<XTarget | undefined> {
    if (!companyTypes.includes(data.typeName as TargetType)) {
      data.typeName = TargetType.Company;
    }
    data.public = false;
    data.teamCode = data.teamCode || data.code;
    data.teamName = data.teamName || data.name;
    const target = await super.createTarget(data);
    if (target) {
      await this.deepLoad(target.id);
      await this.relationService.pullMembers(target, [this.user]);
    }
    return target;
  }

  async deepLoad(companyId: string): Promise<void> {
    await this.groupService.loadGroups(companyId);
    await this.cohortService.loadCohorts(companyId);
  }
}
