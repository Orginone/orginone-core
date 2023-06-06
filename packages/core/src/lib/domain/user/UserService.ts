import { service } from "@/di";
import { kernelApi, AccountApi } from "@/lib/api";
import { PageAll, companyTypes } from "@/lib/core/public/consts";
import { AuthorizationStore } from "@/lib/store/authorization";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state/Store";


@service([AccountApi, kernelApi, "AuthorizationStore", "UserStore"])
export default class UserService {

  constructor(
    api: AccountApi, 
    kernel: kernelApi,
    auth: Store<AuthorizationStore>, 
    user: Store<UserStore>
  ) {
    this.api = api;
    this.kernel = kernel;
    this.auth = auth;
    this.user = user;
  }

  private readonly api: AccountApi;
  private readonly kernel: kernelApi;
  private readonly auth: Store<AuthorizationStore>;
  private readonly user: Store<UserStore>;


  async login(account: string, password: string) {
    const res = await this.api.login(account, password);
    this.auth.setAccessToken(res.data.accessToken);
    this.user.setCurrentUser(res.data.target);
  }

  async loadCompanys() {
    const res = await this.kernel.queryJoinedTargetById({
      id: this.user.currentUser.value.id,
      typeNames: companyTypes,
      page: PageAll,
    });
    return res.data.result!;
  }
}