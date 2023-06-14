import { service } from "@/di";
import * as schema from "@/lib/base/schema";
import { XTarget } from "@/lib/base/schema";
import { ModelRoot } from "@/lib/model/ModelContext";
import { UserStore } from "@/lib/store/user";
import { IState, StateAction, Store } from "@/state";
import CompanyModel from "../company/CompanyModel";
import UserService from "./UserService";
import CohortModel from "../cohort/CohortModel";

/** 人员类型实现 */
@service(["StateAction", UserService, "UserStore", CompanyModel, CohortModel])
export default class UserModel implements ModelRoot<XTarget> {
  readonly stateAction: StateAction;
  readonly service: UserService;
  readonly user: Store<UserStore>;
  readonly companyModel: CompanyModel;
  readonly cohortModel: CohortModel;

  constructor(
    stateAction: StateAction,
    service: UserService,
    user: Store<UserStore>,
    companyModel: CompanyModel,
    cohortModel: CohortModel,
  ) {
    this.stateAction = stateAction;
    this.service = service;
    this.user = user;
    this.companyModel = companyModel;
    this.cohortModel = cohortModel;
    this._companies = this.stateAction.create([]);
    this._cohorts = this.stateAction.create([]);
  }

  private _companies: IState<XTarget[]>;
  private _cohorts: IState<XTarget[]>;
  private _cohortLoaded: boolean = false;
  private _companyLoaded: boolean = false;
  private _givenIdentityLoaded: boolean = false;

  givenIdentities: schema.XIdProof[] = [];

  get companies(): XTarget[] {
    return this._companies.value;
  }

  get cohorts(): XTarget[] {
    return this._cohorts.value;
  }

  get root(): XTarget {
    return this.user.currentUser.value;
  }

  async createModel(root: XTarget): Promise<void> {}

  async loadGivenIdentities(
    reload: boolean = false
  ): Promise<schema.XIdProof[]> {
    if (!this._givenIdentityLoaded || reload) {
      const res = await this.service.queryGivenIdentities();
      if (res.success) {
        this._givenIdentityLoaded = true;
        this.givenIdentities = res.data?.result || [];
      }
    }
    return this.givenIdentities;
  }

  removeGivenIdentity(identityIds: string[], teamId?: string): void {
    let idProofs = this.givenIdentities.filter((a) =>
      identityIds.includes(a.identityId)
    );
    if (teamId) {
      idProofs = idProofs.filter((a) => a.teamId == teamId);
    } else {
      idProofs = idProofs.filter((a) => a.teamId == undefined);
    }
    this.givenIdentities = this.givenIdentities.filter((a) =>
      idProofs.every((i) => i.id !== a.identity?.id)
    );
  }

  // async loadCohorts(reload?: boolean | undefined): Promise<XTarget[]> {
  //   if (!this._cohortLoaded || reload) {
  //     const res = await this.service.queryCohorts(this.root.id);
  //     if (res.success) {
  //       this._cohortLoaded = true;
  //       this._cohorts.value = res.data.result ?? [];
  //     }
  //   }
  //   return this.cohorts;
  // }

  // async loadCompanies(reload?: boolean | undefined): Promise<XTarget[]> {
  //   if (!this._companyLoaded || reload) {
  //     const res = await this.service.queryCompanies(this.root.id);
  //     if (res.success) {
  //       this._companyLoaded = true;
  //       this._companies.value = res.data.result ?? [];
  //     }
  //   }
  //   return this.companies;
  // }

  // async createCompany(data: model.TargetModel): Promise<XTarget | undefined> {
  //   if (!companyTypes.includes(data.typeName as TargetType)) {
  //     data.typeName = TargetType.Company;
  //   }
  //   data.public = false;
  //   data.teamCode = data.teamCode || data.code;
  //   data.teamName = data.teamName || data.name;
  //   const res = await this.service.createTarget(data);
  //   if (res.success && res.data?.id) {
  //     const company = await createCompany(res.data, this);
  //     await company.deepLoad();
  //     this.companys.push(company);
  //     await company.pullMembers([this.metadata]);
  //     return company;
  //   }
  // }

  //   async createTarget(data: model.TargetModel): Promise<ITeam | undefined> {
  //     switch (data.typeName) {
  //       case TargetType.Cohort:
  //         return this.createCohort(data);
  //       default:
  //         return this.createCompany(data);
  //     }
  //   }

  //   authenticate(orgIds: string[], authIds: string[]): boolean {
  //     return (
  //       this.givenIdentities
  //         .filter((i) => i.identity)
  //         .filter((i) => orgIds.includes(i.identity!.shareId))
  //         .filter((i) => authIds.includes(i.identity!.authId)).length > 0
  //     );
  //   }

  //   async applyJoin(members: schema.XTarget[]): Promise<boolean> {
  //     members = members.filter(
  //       (i) =>
  //         [TargetType.Person, TargetType.Cohort, ...companyTypes].includes(
  //           i.typeName as TargetType
  //         ) && i.id != this.id
  //     );
  //     for (const member of members) {
  //       if (member.typeName === TargetType.Person) {
  //         await this.pullMembers([member]);
  //       }
  //       await kernel.applyJoinTeam({
  //         id: member.id,
  //         subId: this.id,
  //       });
  //     }
  //     return true;
  //   }

  //   async searchTargets(
  //     filter: string,
  //     typeNames: string[]
  //   ): Promise<schema.XTarget[]> {
  //     const res = await kernel.searchTargets({
  //       name: filter,
  //       typeNames: typeNames,
  //       page: PageAll,
  //     });
  //     if (res.success) {
  //       return res.data.result || [];
  //     }
  //     return [];
  //   }

  //   async exit(): Promise<boolean> {
  //     return false;
  //   }

  //   override async delete(): Promise<boolean> {
  //     await this.createTargetMsg(OperateType.Remove, this.metadata);
  //     const res = await kernel.deleteTarget({
  //       id: this.id,
  //     });
  //     return res.success;
  //   }

  //   get subTarget(): ITarget[] {
  //     return [];
  //   }

  //   get shareTarget(): ITarget[] {
  //     return [this, ...this.cohorts];
  //   }

  //   get parentTarget(): ITarget[] {
  //     return [...this.cohorts, ...this.companys];
  //   }

  //   get chats(): IMsgChat[] {
  //     const chats: IMsgChat[] = [this];
  //     chats.push(...this.cohortChats);
  //     chats.push(...this.memberChats);
  //     return chats;
  //   }

  //   get cohortChats(): IMsgChat[] {
  //     const chats: IMsgChat[] = [];
  //     const companyChatIds: string[] = [];
  //     this.companys.forEach((company) => {
  //       company.cohorts.forEach((item) => {
  //         companyChatIds.push(item.chatdata.fullId);
  //       });
  //     });
  //     for (const item of this.cohorts) {
  //       if (!companyChatIds.includes(item.chatdata.fullId)) {
  //         chats.push(...item.chats);
  //       }
  //     }
  //     if (this.superAuth) {
  //       chats.push(...this.superAuth.chats);
  //     }
  //     return chats;
  //   }

  //   get targets(): ITarget[] {
  //     const targets: ITarget[] = [this];
  //     for (const item of this.companys) {
  //       targets.push(...item.targets);
  //     }
  //     for (const item of this.cohorts) {
  //       targets.push(...item.targets);
  //     }
  //     return targets;
  //   }

  //   async deepLoad(reload: boolean = false): Promise<void> {
  //     await this.loadGivedIdentitys(reload);
  //     await this.loadCompanys(reload);
  //     await this.loadCohorts(reload);
  //     await this.loadMembers(reload);
  //     await this.loadSuperAuth(reload);
  //     await this.loadSpecies(reload);
  //     for (const company of this.companys) {
  //       await company.deepLoad(reload);
  //     }
  //     for (const cohort of this.cohorts) {
  //       await cohort.deepLoad(reload);
  //     }
  //     this.superAuth?.deepLoad(reload);
  //   }

  //   async teamChangedNotity(target: schema.XTarget): Promise<boolean> {
  //     switch (target.typeName) {
  //       case TargetType.Cohort:
  //         if (this.cohorts.every((i) => i.id != target.id)) {
  //           const cohort = new Cohort(target, this);
  //           await cohort.deepLoad();
  //           this.cohorts.push(cohort);
  //           return true;
  //         }
  //         break;
  //       default:
  //         if (companyTypes.includes(target.typeName as TargetType)) {
  //           if (this.companys.every((i) => i.id != target.id)) {
  //             const company = createCompany(target, this);
  //             await company.deepLoad();
  //             this.companys.push(company);
  //             return true;
  //           }
  //         }
  //     }
  //     return false;
  //   }

  //   async findEntityAsync(id: string): Promise<schema.XEntity | undefined> {
  //     const metadata = this.findMetadata<schema.XEntity>(id);
  //     if (metadata) {
  //       return metadata;
  //     }
  //     const res = await kernel.queryEntityById({ id: id });
  //     if (res.success && res.data?.id) {
  //       this.updateMetadata(res.data);
  //       return res.data;
  //     }
  //   }

  //   findShareById(id: string): model.ShareIcon {
  //     const metadata = this.findMetadata<schema.XEntity>(id);
  //     if (!metadata) {
  //       kernel
  //         .queryTargetById({
  //           ids: [id],
  //           page: PageAll,
  //         })
  //         .then((res) => {
  //           if (res.success && res.data.result) {
  //             res.data.result.forEach((item) => {
  //               this.updateMetadata(item);
  //             });
  //           }
  //         });
  //     }
  //     return {
  //       name: metadata?.name ?? "请稍后...",
  //       typeName: metadata?.typeName ?? "未知",
  //       avatar: parseAvatar(metadata?.icon),
  //     };
  //   }
}
