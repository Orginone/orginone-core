import { autowired } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import { UserStore } from "@/lib/store/user";
import { Store } from "@/state";
import TargetModel from "../base/TargetModel";
import RelationModel from "../relation/RelationModel";
import RelationService from "../relation/RelationService";
import { PageAll } from "@/lib/base/consts";
import { XTarget } from "@/lib/base/schema";
import { model } from "@/lib/base";

export default class TargetService {
  @autowired(KernelApi)
  readonly kernel: KernelApi = null!;

  @autowired("UserStore")
  readonly userStore: Store<UserStore> = null!;

  @autowired(TargetModel)
  readonly targets: TargetModel = null!;

  @autowired(RelationModel)
  readonly relations: RelationModel = null!;

  @autowired(RelationService)
  readonly relationService: RelationService = null!;

  get userId(): string {
    return this.userStore.currentUser.value.id;
  }

  get user(): XTarget {
    return this.userStore.currentUser.value;
  }

  /**
   * 创建一个目标对象
   * @param target 目标对象
   * @returns
   */
  async createTarget(target: model.TargetModel): Promise<XTarget | undefined> {
    let res = await this.kernel.createTarget(target);
    if (res.success) {
      this.targets.insert(res.data);
      return res.data;
    }
    return;
  }

  /**
   * 加载成员
   * @param teamId 组织
   * @param typeNames 子类型
   */
  async loadMembers(teamId: string, typeNames: string[]): Promise<XTarget[]> {
    const res = await this.kernel.querySubTargetById({
      id: teamId,
      subTypeNames: typeNames,
      page: PageAll,
    });
    if (res.success) {
      let subTargets = res.data.result ?? [];
      this.targets.insertBatch(subTargets);
      subTargets.forEach((target) => {
        this.relationService.generateRelations(target.id, [teamId]);
      });
      return subTargets;
    }
    return [];
  }

  /**
   * 加载加入的组织
   * @param targetId 目标 ID
   * @returns
   */
  async loadTeam(targetId: string, typeNames: string[]): Promise<XTarget[]> {
    const res = await this.kernel.queryJoinedTargetById({
      id: targetId,
      typeNames: typeNames,
      page: PageAll,
    });
    if (res.success) {
      let teams = res.data.result ?? [];
      this.targets.insertBatch(teams);
      this.relationService.generateRelations(
        targetId,
        teams.map((team) => team.id)
      );
      return teams;
    }
    return [];
  }
}
