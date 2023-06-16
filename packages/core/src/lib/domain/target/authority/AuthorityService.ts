import { autowired } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import { PageAll } from "@/lib/base/consts";
import { XAuthority } from "@/lib/base/schema";
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
      this.authorities.insert(res.data);
    }
  }
}
