import { autowired, service } from "@/di";
import { AccountApi } from "@/lib/api";
import KernelApi from "@/lib/api/kernelapi";
import { model, schema } from "@/lib/base";
import { XTarget } from "@/lib/base/schema";
import { AuthorizationStore } from "@/lib/store/authorization";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state/Store";
import UserModel from "./UserModel";

export default class UserService {
  @autowired(AccountApi)
  private readonly api: AccountApi = null!;

  @autowired(KernelApi)
  private readonly kernel: KernelApi = null!;

  @autowired("AuthorizationStore")
  private readonly auth: Store<AuthorizationStore> = null!;

  @autowired("UserStore")
  private readonly user: Store<UserStore> = null!;

  @autowired(UserModel)
  private readonly userModel: UserModel = null!;

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

  async loadGivenIdentities(reload: boolean = false): Promise<void> {
    const res = await this.kernel.queryGivenIdentities();
    if (res.success) {
      this.userModel.givenIdentities = res.data?.result || [];
    }
  }

  removeGivenIdentity(identityIds: string[], teamId?: string): void {
    let idProofs = this.userModel.givenIdentities.filter((a) =>
      identityIds.includes(a.identityId)
    );
    if (teamId) {
      idProofs = idProofs.filter((a) => a.teamId == teamId);
    } else {
      idProofs = idProofs.filter((a) => a.teamId == undefined);
    }
    this.userModel.givenIdentities = this.userModel.givenIdentities.filter(
      (a) => idProofs.every((i) => i.id !== a.identity?.id)
    );
  }
}
