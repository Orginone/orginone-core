import { model } from "@/lib/base";
import { TargetType } from "@/lib/base/enums";
import { XTarget } from "@/lib/base/schema";
import TargetService from "../base/TargetService";

export default class CohortService extends TargetService {
  /**
   * 创建一个群组
   * @param cohort
   */
  async createCohort(cohort: model.TargetModel) {
    cohort.typeName = TargetType.Cohort;
    let target = await super.createTarget(cohort);
    if (target) {
      await this.relationService.pullMembers(target, [this.user]);
    }
  }

  /**
   * 加载用户群组
   */
  async loadUserCohorts(): Promise<void> {
    await this.loadCohorts(this.userId);
  }

  /**
   * 加载目标的群组
   * @param targetId 目标 ID
   * @returns
   */
  async loadCohorts(targetId: string): Promise<XTarget[]> {
    return await super.loadTeam(targetId, [TargetType.Cohort]);
  }

  /**
   * 深加载
   */
  async deepLoad(cohortId: string): Promise<void> {
    await this.loadMembers(cohortId, [TargetType.Person]);
  }
}
