import { autowired } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import { PageAll, companyTypes } from "@/lib/core/public/consts";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state";
import CompanyModel from "./CompanyModel";
import RelationService from "../relation/RelationService";

export default class CompanyService {
  @autowired("UserStore")
  private readonly user: Store<UserStore> = null!;

  @autowired(KernelApi)
  private readonly kernel: KernelApi = null!;

  @autowired(RelationService)
  private readonly relationService: RelationService = null!;

  @autowired(CompanyModel)
  private readonly companies: CompanyModel = null!;

  get userId() {
    return this.user.currentUser.value.id;
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
}
