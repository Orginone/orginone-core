import { autowired } from "@/di";
import { AccountApi } from "@/lib/api";
import { schema } from "@/lib/base";
import { PageAll, companyTypes } from "@/lib/base/consts";
import { TargetType } from "@/lib/base/enums";
import { AuthorizationStore } from "@/lib/store/authorization";
import { Store } from "@/state/Store";
import SpeciesService from "../../thing/species/speciesService";
import AuthorityService from "../authority/AuthorityService";
import TargetService from "../base/TargetService";
import CohortService from "../cohort/CohortService";
import CompanyService from "../company/CompanyService";
import UserModel from "./UserModel";

export default class PersonService extends TargetService {
  @autowired(AccountApi)
  readonly api: AccountApi = null!;

  @autowired("AuthorizationStore")
  readonly auth: Store<AuthorizationStore> = null!;

  @autowired(UserModel)
  readonly currentUser: UserModel = null!;

  @autowired(CompanyService)
  readonly companyService: CompanyService = null!;

  @autowired(CohortService)
  readonly cohortService: CohortService = null!;

  @autowired(AuthorityService)
  readonly authorityService: AuthorityService = null!;

  @autowired(SpeciesService)
  readonly speciesService: SpeciesService = null!;

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
   * 加载身份
   */
  async loadGivenIdentities(): Promise<void> {
    const res = await this.kernel.queryGivedIdentitys();
    if (res.success) {
      this.currentUser.givenIdentities = res.data?.result || [];
    }
  }

  /**
   * 删除身份
   * @param identityIds
   * @param teamId
   */
  removeGivenIdentity(identityIds: string[], teamId?: string): void {
    let idProofs = this.currentUser.givenIdentities.filter((a) =>
      identityIds.includes(a.identityId)
    );
    if (teamId) {
      idProofs = idProofs.filter((a) => a.teamId == teamId);
    } else {
      idProofs = idProofs.filter((a) => a.teamId == undefined);
    }
    this.currentUser.givenIdentities = this.currentUser.givenIdentities.filter(
      (a) => idProofs.every((i) => i.id !== a.identity?.id)
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
        await this.relationService.pullMembers(member, [this.currentUser.root]);
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
   * 深加载
   * @param reload
   */
  async deepLoad(): Promise<void> {
    await this.loadGivenIdentities();
    await this.companyService.loadUserCompanies();
    await this.cohortService.loadUserCohorts();
    await this.authorityService.loadSuperAuth(this.userId);
    for (const company of this.currentUser.companies) {
      await this.companyService.deepLoad(company.id);
    }
    for (const cohort of this.currentUser.cohorts) {
      await this.cohortService.deepLoad(cohort.id);
    }
  }
}
