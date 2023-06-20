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

  async loadSuperAuth(belongId: string): Promise<void> {
    const res = await this.kernel.queryAuthorityTree({
      id: belongId,
      page: PageAll,
    });
    if (res.success && res.data?.id) {
      let data = res.data ?? [];
      this.authorities.recursionInsert(belongId, [data]);
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
      this.authorities.insert(authority);
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
      this.authorities.updateById(authority);
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
      this.authorities.removeById(authority.id);
    }
    return res.success;
  }
}
