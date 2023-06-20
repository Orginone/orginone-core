import { autowired, service } from "@/di";
import * as schema from "@/lib/base/schema";
import { XTarget } from "@/lib/base/schema";
import { ModelRoot } from "@/lib/model/ModelContext";
import { UserStore } from "@/lib/store/user";
import { StateAction, Store } from "@/state";
import CohortModel from "../cohort/CohortModel";
import CompanyModel from "../company/CompanyModel";
import SpeciesModel from "../../thing/base/species/speciesModel";

/** 人员类型实现 */
@service(["StateAction", "UserStore", CompanyModel, CohortModel, SpeciesModel])
export default class UserModel implements ModelRoot<XTarget> {
  readonly stateAction: StateAction;
  readonly userStore: Store<UserStore>;
  readonly companies: CompanyModel;
  readonly cohorts: CohortModel;
  readonly multiSpecies: SpeciesModel;

  constructor(
    stateAction: StateAction,
    userStore: Store<UserStore>,
    companyModel: CompanyModel,
    cohortModel: CohortModel,
    speciesModel: SpeciesModel
  ) {
    this.stateAction = stateAction;
    this.userStore = userStore;
    this.companies = companyModel;
    this.cohorts = cohortModel;
    this.multiSpecies = speciesModel;
  }

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
}
