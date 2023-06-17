import { autowired } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import { model } from "@/lib/base";
import { XTarget } from "@/lib/base/schema";
import { PageAll, companyTypes } from "@/lib/base/consts";
import { TargetType } from "@/lib/base/enums";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state";
import RelationService from "../relation/RelationService";
import CompanyModel from "./CompanyModel";
import { RelationType } from "../relation/RelationModel";

export default class CompanyService {
  @autowired("UserStore")
  readonly userStore: Store<UserStore> = null!;

  @autowired(KernelApi)
  readonly kernel: KernelApi = null!;

  @autowired(CompanyModel)
  readonly companies: CompanyModel = null!;

  @autowired(RelationService)
  readonly relationService: RelationService = null!;

  get userId() {
    return this.user.id;
  }

  get user() {
    return this.userStore.currentUser.value;
  }

  async loadUserCompanies(): Promise<number> {
    const res = await this.kernel.queryJoinedTargetById({
      id: this.userId,
      typeNames: companyTypes,
      page: PageAll,
    });
    if (res.success) {
      await this.companies.createModel(res.data.result ?? []);
      let teamIds = this.companies.data.map((item) => item.id);
      this.relationService.generateRelations(
        RelationType.Targets,
        this.userId,
        teamIds
      );
      return teamIds.length;
    }
    return 0;
  }

  async createCompany(data: model.TargetModel): Promise<XTarget | undefined> {
    if (!companyTypes.includes(data.typeName as TargetType)) {
      data.typeName = TargetType.Company;
    }
    data.public = false;
    data.teamCode = data.teamCode || data.code;
    data.teamName = data.teamName || data.name;
    const res = await this.kernel.createTarget(data);
    if (res.success && res.data?.id) {
      await this.deepLoad(res.data.id);
      this.companies.insert(res.data);
      await this.relationService.pullMembers(res.data, [this.user]);
      return res.data;
    }
  }

  async deepLoad(companyId: string): Promise<void> {}
}
