import { service } from "@/di";
import { XTarget } from "@/lib/base/schema";
import { CollectionImpl } from "@/lib/model/ModelContext";
import CohortService from "./CohortService";
import { IState, StateAction, Store } from "@/state";
import { UserStore } from "@/lib/store/user";

@service(["StateAction", "UserStore", CohortService])
export default class CohortModel extends CollectionImpl<XTarget> {
  private readonly service: CohortService;
  private readonly userStore: Store<UserStore>;

  constructor(
    stateAction: StateAction,
    userStore: Store<UserStore>,
    service: CohortService
  ) {
    super();
    this.userStore = userStore;
    this.service = service;
    this._cohorts = stateAction.create(this.collection);
  }

  private _cohorts: IState<XTarget[]>;
  private _cohortLoaded: boolean = false;

  get cohorts(): XTarget[] {
    return this._cohorts.value;
  }

  TargetCohorts(targetId: string): XTarget[] {
    return this._cohorts;
  }

  get userId(): string {
    return this.userStore.currentUser.value.id;
  }

  async loadUserCohort(reload?: boolean | undefined): Promise<XTarget[]> {
    if (!this._cohortLoaded || reload) {
      const res = await this.service.queryCohorts(this.userId);
      if (res.success) {
        this._cohortLoaded = true;

        this._cohorts.value = res.data.result ?? [];
      }
    }
    return this.cohorts;
  }
}
