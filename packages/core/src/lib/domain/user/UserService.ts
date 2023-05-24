import { service } from "@/di";
import AccountApi from "@/lib/api/account";
import { AuthorizationStore } from "@/lib/store/authorization";
import { ResultType } from "@/network/request";
import { Store } from "@/state/Store";


@service([AccountApi, "AuthorizationStore"])
export default class UserService {

  constructor(api: AccountApi, store: Store<AuthorizationStore>) {
    this.api = api;
    this.store = store;
  }

  private readonly api: AccountApi;
  private readonly store: Store<AuthorizationStore>;


  async login(account: string, password: string) {
    const res: ResultType<any> = await this.api.login(account, password);
    this.store.setAccessToken(res.data.accessToken);
  }
}