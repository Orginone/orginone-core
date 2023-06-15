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

export default class CompanyService {
  @autowired("UserStore")
  private readonly userStore: Store<UserStore> = null!;

  @autowired(KernelApi)
  private readonly kernel: KernelApi = null!;

  @autowired(CompanyModel)
  private readonly companies: CompanyModel = null!;

  @autowired(RelationService)
  private readonly relationService: RelationService = null!;

  get userId() {
    return this.user.id;
  }

  get user() {
    return this.userStore.currentUser.value;
  }

  private _companyLoaded: boolean = false;

  async loadCompanies(reload?: boolean | undefined): Promise<void> {
    if (!this._companyLoaded || reload) {
      const res = await this.kernel.queryJoinedTargetById({
        id: this.userId,
        typeNames: companyTypes,
        page: PageAll,
      });
      if (res.success) {
        this._companyLoaded = true;
        await this.companies.createModel(res.data.result ?? []);
        let teamIds = this.companies.collection.map((item) => item.id);
        this.relationService.generateRelations(this.userId, teamIds);
      }
    }
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
      await this.deepLoad();
      this.companies.insert(res.data);
      await this.relationService.pullMembers(res.data, [this.user]);
      return res.data;
    }
  }

  async deepLoad(): Promise<void> {}
}
