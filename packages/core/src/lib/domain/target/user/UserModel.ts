import { autowired } from "@/di";
import * as schema from "@/lib/base/schema";
import { XTarget } from "@/lib/base/schema";
import { ModelRoot } from "@/lib/model/ModelContext";
import { UserStore } from "@/lib/store/user";
import { StateAction, Store } from "@/state";
import CohortModel from "../cohort/CohortModel";
import CompanyModel from "../company/CompanyModel";
import UserService from "./UserService";

/** 人员类型实现 */
export default class UserModel implements ModelRoot<XTarget> {
  @autowired("UserStore")
  private readonly userStore: Store<UserStore> = null!;
  @autowired(CompanyModel)
  private readonly companies: CompanyModel = null!;
  @autowired(CohortModel)
  private readonly cohorts: CohortModel = null!;

  private _givenIdentities: schema.XIdProof[] = [];

  set givenIdentities(givenIdentities: schema.XIdProof[]) {
    this._givenIdentities = givenIdentities;
  }

  get givenIdentities() {
    return this._givenIdentities;
  }

  get root(): XTarget {
    return this.userStore.currentUser.value;
  }

  async createModel(_root: XTarget): Promise<void> {}

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
