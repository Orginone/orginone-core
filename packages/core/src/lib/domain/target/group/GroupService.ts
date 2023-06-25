import { model, schema } from "@/lib/base";
import { TargetType } from "@/lib/base/enums";
import { XTarget } from "@/lib/base/schema";
import TargetService from "../base/TargetService";

export default class GroupService extends TargetService {
  /**
   * 加载单位加入的集团
   */
  async loadGroups(companyId: string): Promise<XTarget[]> {
    return await super.loadTeam(companyId, [TargetType.Group]);
  }

  /**
   * 创建集团
   * @param group
   * @param subGroup
   * @returns
   */
  async createGroup(
    company: XTarget,
    group: model.TargetModel
  ): Promise<XTarget | undefined> {
    group.typeName = TargetType.Group;
    const target = await super.createTarget(group);
    if (target) {
      await this.relationService.pullMembers(target, [company]);
    }
    return target;
  }

  /**
   * 创建子集团
   */
  async createChildren(
    group: schema.XTarget,
    subGroup: model.TargetModel
  ): Promise<XTarget | undefined> {
    subGroup.typeName = TargetType.Group;
    const target = await super.createTarget(subGroup);
    if (target) {
      await this.relationService.pullMembers(group, [target]);
    }
    return target;
  }

  /**
   * 加载集团的子集团
   * @param group 集团
   * @returns 子集团
   */
  async loadChildren(group: XTarget): Promise<XTarget[]> {
    return await super.loadMembers(group.id, [TargetType.Group]);
  }

  /**
   * 移除单位
   */
  async removeCompany(group: XTarget, company: XTarget) {
    await this.relationService.removeMembers(group, [company]);
  }

  /**
   * 删除集团
   */
  async deleteGroup(group: XTarget) {
    await this.kernel.deleteTarget({ id: group.id });
  }
}
