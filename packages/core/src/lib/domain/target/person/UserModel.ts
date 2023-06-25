import { service } from "@/di";
import * as schema from "@/lib/base/schema";
import { XTarget } from "@/lib/base/schema";
import { ModelRoot } from "@/lib/model/ModelContext";
import { UserStore } from "@/lib/store/user";
import { StateAction, Store } from "@/state";
import SpeciesModel from "../../thing/base/species/speciesModel";
import TargetModel from "../base/TargetModel";

/** 人员类型实现 */
@service(["StateAction", "UserStore", TargetModel, SpeciesModel])
export default class UserModel implements ModelRoot<XTarget> {
  readonly stateAction: StateAction;
  readonly userStore: Store<UserStore>;
  readonly targets: TargetModel;
  readonly multiSpecies: SpeciesModel;

  constructor(
    stateAction: StateAction,
    userStore: Store<UserStore>,
    targets: TargetModel,
    speciesModel: SpeciesModel
  ) {
    this.stateAction = stateAction;
    this.userStore = userStore;
    this.targets = targets;
    this.multiSpecies = speciesModel;
  }

  get root(): XTarget {
    return this.userStore.currentUser.value;
  }

  get id(): string {
    return this.userStore.currentUser.value.id;
  }

  get companies(): XTarget[] {
    return this.targets.findCompanies(this.id);
  }

  get cohorts(): XTarget[] {
    return this.targets.findCohorts(this.id);
  }

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
}
