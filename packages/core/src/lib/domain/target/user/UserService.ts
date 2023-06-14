import { service } from "@/di";
import { AccountApi } from "@/lib/api";
import KernelApi from "@/lib/api/kernelapi";
import { model } from "@/lib/base";
import { XIdProofArray, XTarget } from "@/lib/base/schema";
import { AuthorizationStore } from "@/lib/store/authorization";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state/Store";

@service([AccountApi, KernelApi, "AuthorizationStore", "UserStore"])
export default class UserService {
  constructor(
    api: AccountApi,
    kernel: KernelApi,
    auth: Store<AuthorizationStore>,
    user: Store<UserStore>
  ) {
    this.api = api;
    this.kernel = kernel;
    this.auth = auth;
    this.user = user;
  }

  readonly api: AccountApi;
  readonly kernel: KernelApi;
  readonly auth: Store<AuthorizationStore>;
  readonly user: Store<UserStore>;

  async login(account: string, password: string) {
    const res = await this.api.login(account, password);
    this.auth.setAccessToken(res.data.accessToken);
    this.user.setCurrentUser(res.data.target);
  }

  async createTarget(
    target: model.TargetModel
  ): Promise<model.ResultType<XTarget>> {
    return await this.kernel.createTarget(target);
  }

  async queryGivenIdentities(): Promise<model.ResultType<XIdProofArray>> {
    return await this.kernel.queryGivenIdentities();
  }
}
