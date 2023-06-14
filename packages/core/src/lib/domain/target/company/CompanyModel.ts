import { service } from "@/di";
import { XTarget } from "@/lib/base/schema";
import { CollectionImpl } from "@/lib/model/ModelContext";
import { IState, StateAction, Store } from "@/state";
import CompanyService from "./CompanyService";
import { UserStore } from "@/lib/store/user";

@service(["StateAction", "UserStore", CompanyService])
export default class CompanyModel extends CollectionImpl<XTarget> {
  private readonly service: CompanyService;
  private readonly userStore: Store<UserStore>;

  constructor(
    stateAction: StateAction,
    userStore: Store<UserStore>,
    service: CompanyService
  ) {
    super();
    this.userStore = userStore;
    this.service = service;
    this._companies = stateAction.create(this.collection);
  }

  private _companies: IState<XTarget[]>;
  private _companyLoaded: boolean = false;

  get companies(): XTarget[] {
    return this._companies.value;
  }

  get userId(): string {
    return this.userStore.currentUser.value.id;
  }

  async loadCompanies(reload?: boolean | undefined): Promise<XTarget[]> {
    if (!this._companyLoaded || reload) {
      const res = await this.service.queryCompanies(this.userId);
      if (res.success) {
        this._companyLoaded = true;
        await this.createModel(res.data.result ?? []);
      }
    }
    return this.companies;
  }
}
