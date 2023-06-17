import { autowired, service } from "@/di";
import { AccountApi } from "@/lib/api";
import KernelApi from "@/lib/api/kernelapi";
import { model, schema } from "@/lib/base";
import { XTarget } from "@/lib/base/schema";
import { AuthorizationStore } from "@/lib/store/authorization";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state/Store";
import UserModel from "./UserModel";
import { OperateType, TargetType } from "@/lib/base/enums";
import { PageAll, companyTypes } from "@/lib/base/consts";
import RelationService from "../relation/RelationService";
import CompanyService from "../company/CompanyService";
import CohortService from "../cohort/CohortService";
import AuthorityService from "../authority/AuthorityService";
import SpeciesService from "../../thing/base/species/speciesService";

export default class PersonService {
  @autowired(AccountApi)
  readonly api: AccountApi = null!;

  @autowired(KernelApi)
  readonly kernel: KernelApi = null!;

  @autowired("AuthorizationStore")
  readonly auth: Store<AuthorizationStore> = null!;

  @autowired("UserStore")
  readonly userStore: Store<UserStore> = null!;

  @autowired(UserModel)
  readonly user: UserModel = null!;

  @autowired(RelationService)
  readonly relationService: RelationService = null!;

  @autowired(CompanyService)
  readonly companyService: CompanyService = null!;

  @autowired(CohortService)
  readonly cohortService: CohortService = null!;

  @autowired(AuthorityService)
  readonly authorityService: AuthorityService = null!;

  @autowired(SpeciesService)
  readonly speciesService: SpeciesService = null!;

  get userId() {
    return this.user.root.id;
  }

  /**
   * 登录
   * @param account
   * @param password
   */
  async login(account: string, password: string) {
    const res = await this.api.login(account, password);
    this.auth.setAccessToken(res.data.accessToken);
    this.userStore.setCurrentUser(res.data.target);
  }

  /**
   * 创建组织
   * @param target
   * @returns
   */
  async createTarget(
    target: model.TargetModel
  ): Promise<model.ResultType<XTarget>> {
    return await this.kernel.createTarget(target);
  }

  /**
   * 加载身份
   */
  async loadGivenIdentities(): Promise<void> {
    const res = await this.kernel.queryGivenIdentities();
    if (res.success) {
      this.user.givenIdentities = res.data?.result || [];
    }
  }

  /**
   * 删除身份
   * @param identityIds
   * @param teamId
   */
  removeGivenIdentity(identityIds: string[], teamId?: string): void {
    let idProofs = this.user.givenIdentities.filter((a) =>
      identityIds.includes(a.identityId)
    );
    if (teamId) {
      idProofs = idProofs.filter((a) => a.teamId == teamId);
    } else {
      idProofs = idProofs.filter((a) => a.teamId == undefined);
    }
    this.user.givenIdentities = this.user.givenIdentities.filter((a) =>
      idProofs.every((i) => i.id !== a.identity?.id)
    );
  }

  /**
   * 同意别人主动加入我
   * @param members 请求我的成员
   */
  async applyJoin(members: schema.XTarget[]): Promise<void> {
    let canJoin = [TargetType.Person, TargetType.Cohort, ...companyTypes];
    members = members.filter(
      (i) => canJoin.includes(i.typeName as TargetType) && i.id != this.userId
    );
    for (const member of members) {
      if (member.typeName === TargetType.Person) {
        await this.relationService.pullMembers(member, [this.user.root]);
      }
      await this.kernel.applyJoinTeam({
        id: member.id,
        subId: this.userId,
      });
    }
  }

  /**
   * 搜索对象（无状态）
   * @param f
   * @param types
   * @returns
   */
  async searchTargets(f: string, types: string[]): Promise<schema.XTarget[]> {
    const res = await this.kernel.searchTargets({
      name: f,
      typeNames: types,
      page: PageAll,
    });
    if (res.success) {
      return res.data.result || [];
    }
    return [];
  }

  /**
   * 删除用户
   * @returns
   */
  async delete(): Promise<boolean> {
    let remove = OperateType.Remove;
    await this.relationService.createTargetMsg(this.user.root, remove);
    const res = await this.kernel.deleteTarget({
      id: this.userId,
    });
    return res.success;
  }

  /**
   * 深加载
   * @param reload
   */
  async deepLoad(): Promise<void> {
    await this.loadGivenIdentities();
    await this.companyService.loadUserCompanies();
    await this.cohortService.loadUserCohorts();
    await this.authorityService.loadSuperAuth(this.userId);
    await this.speciesService.loadSpecies(this.user.root);
    for (const company of this.user.companies.data) {
      await this.companyService.deepLoad(company.id);
    }
    for (const cohort of this.user.cohorts.data) {
      await this.cohortService.deepLoad(cohort.id);
    }
    // this.superAuth?.deepLoad(reload);
  }
}
