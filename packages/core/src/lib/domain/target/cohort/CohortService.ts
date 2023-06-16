import { autowired } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import { PageAll } from "@/lib/base/consts";
import { TargetType } from "@/lib/base/enums";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state";
import CohortModel from "./CohortModel";
import RelationService from "../relation/RelationService";

export default class CohortService {
  @autowired(KernelApi)
  private readonly kernel: KernelApi = null!;

  @autowired("UserStore")
  private readonly userStore: Store<UserStore> = null!;

  @autowired(CohortModel)
  private readonly cohortModel: CohortModel = null!;

  @autowired(RelationService)
  private readonly relationService: RelationService = null!;

  get userId(): string {
    return this.userStore.currentUser.value.id;
  }

  async loadUserCohorts(): Promise<void> {
    await this.loadCohorts(this.userId);
  }

  async loadCohorts(targetId: string): Promise<void> {
    const res = await this.kernel.queryJoinedTargetById({
      id: targetId,
      typeNames: [TargetType.Cohort],
      page: PageAll,
    });
    if (res.success) {
      await this.cohortModel.createModel(res.data.result ?? []);
      let teamIds = this.cohortModel.collection.map((item) => item.id);
      this.relationService.generateRelations(this.userId, teamIds);
    }
  }
}
