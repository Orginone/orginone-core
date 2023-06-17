import { autowired } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import { model } from "@/lib/base";
import { PageAll } from "@/lib/base/consts";
import { XAuthority, XTarget } from "@/lib/base/schema";
import AuthorityModel from "./AuthorityModel";

export default class AuthorityService {
  @autowired(KernelApi)
  private readonly kernel: KernelApi = null!;

  @autowired(AuthorityModel)
  private readonly authorities: AuthorityModel = null!;

  async loadSuperAuth(targetId: string): Promise<void> {
    const res = await this.kernel.queryAuthorityTree({
      id: targetId,
      page: PageAll,
    });
    if (res.success && res.data?.id) {
      this.authorities.removeFirst((item) => (item.id = res.data.id));
      this.authorities.insert(res.data);
    }
  }

  /**
   * 加载权限的人
   * @param authorityId
   * @param belongId
   */
  async loadMembers(authorityId: string, belongId: string): Promise<XTarget[]> {
    const res = await this.kernel.queryAuthorityTargets({
      id: authorityId,
      subId: belongId,
    });
    return res.data?.result || [];
  }

  /**
   * 创建权限
   */
  async create(data: model.AuthorityModel): Promise<XAuthority | undefined> {
    const res = await this.kernel.createAuthority(data);
    if (res.success && res.data?.id) {
      let authority = res.data;
      await this.loadSuperAuth(authority.belongId);
      return authority;
    }
  }

  /**
   * 更新权限
   */
  async update(data: model.AuthorityModel): Promise<boolean> {
    const res = await this.kernel.updateAuthority(data);
    if (res.success && res.data?.id) {
      let authority = res.data;
      authority.typeName = "权限";
      await this.loadSuperAuth(authority.belongId);
    }
    return res.success;
  }

  /**
   * 删除一条数据
   * @returns
   */
  async delete(authority: XAuthority): Promise<boolean> {
    const res = await this.kernel.deleteAuthority({
      id: authority.id,
    });
    if (res.success) {
      await this.loadSuperAuth(authority.belongId);
    }
    return res.success;
  }

  /**
   * 深加载
   */
  async deepLoad(): Promise<void> {}
}
