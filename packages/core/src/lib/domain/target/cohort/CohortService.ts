import { autowired } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import { PageAll } from "@/lib/base/consts";
import { TargetType } from "@/lib/base/enums";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state";
import CohortModel from "./CohortModel";
import RelationService from "../relation/RelationService";
import { RelationType } from "../relation/RelationModel";

export default class CohortService {
  @autowired(KernelApi)
  private readonly kernel: KernelApi = null!;

  @autowired("UserStore")
  private readonly userStore: Store<UserStore> = null!;

  @autowired(CohortModel)
  private readonly cohorts: CohortModel = null!;

  @autowired(RelationService)
  private readonly relationService: RelationService = null!;

  get userId(): string {
    return this.userStore.currentUser.value.id;
  }

  async loadUserCohorts(): Promise<void> {
    await this.loadCohorts(this.userId);
  }

  /**
   * 加载目标的群组
   * @param targetId 目标 ID
   * @returns 
   */
  async loadCohorts(targetId: string): Promise<number> {
    const res = await this.kernel.queryJoinedTargetById({
      id: targetId,
      typeNames: [TargetType.Cohort],
      page: PageAll,
    });
    if (res.success) {
      let data = res.data.result ?? [];
      this.cohorts.removeByTargetId(targetId);
      this.cohorts.insertBatch(data);

      let teamIds = data.map((item) => item.id);
      let relationType = RelationType.Targets;
      this.relationService.generateRelations(relationType, targetId, teamIds);
      return data.length;
    }
    return 0;
  }

  /**
   * 深加载
   * @param targetId
   */
  async deepLoad(targetId: string): Promise<void> {}
}
