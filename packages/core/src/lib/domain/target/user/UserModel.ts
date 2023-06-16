import { autowired } from "@/di";
import * as schema from "@/lib/base/schema";
import { XTarget } from "@/lib/base/schema";
import { ModelRoot } from "@/lib/model/ModelContext";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state";
import CohortModel from "../cohort/CohortModel";
import CompanyModel from "../company/CompanyModel";

/** 人员类型实现 */
export default class UserModel implements ModelRoot<XTarget> {
  @autowired("UserStore")
  private readonly userStore: Store<UserStore> = null!;
  @autowired(CompanyModel)
  private readonly companies: CompanyModel = null!;
  @autowired(CohortModel)
  private readonly cohorts: CohortModel = null!;

  async createModel(_root: XTarget): Promise<void> {}

  private _givenIdentities: schema.XIdProof[] = [];

  set givenIdentities(givenIdentities: schema.XIdProof[]) {
    this._givenIdentities = givenIdentities;
  }

  get givenIdentities() {
    return this._givenIdentities;
  }

  authenticate(orgIds: string[], authIds: string[]): boolean {
    return (
      this.givenIdentities
        .filter((i) => i.identity)
        .filter((i) => orgIds.includes(i.identity!.shareId))
        .filter((i) => authIds.includes(i.identity!.authId)).length > 0
    );
  }

  get root(): XTarget {
    return this.userStore.currentUser.value;
  }

  get subTarget(): XTarget[] {
    return [];
  }

  get shareTarget(): XTarget[] {
    let shareCohorts = this.cohorts.getCohortsByTargetId(this.root.id);
    return [this.root, ...shareCohorts];
  }

  get parentTarget(): XTarget[] {
    let parentCohorts = this.cohorts.getCohortsByTargetId(this.root.id);
    let parentCompanies = this.companies.getCompaniesByTargetId(this.root.id);
    return [...parentCohorts, ...parentCompanies];
  }

  get targets(): XTarget[] {
    const targets: XTarget[] = [this.root];
    let parentCompanies = this.companies.getCompaniesByTargetId(this.root.id);
    for (const item of parentCompanies) {
      targets.push(...this.companies.targets(item.id));
    }
    let parentCohorts = this.cohorts.getCohortsByTargetId(this.root.id);
    for (const item of parentCohorts) {
      targets.push(...this.cohorts.targets(item.id));
    }
    return targets;
  }

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
