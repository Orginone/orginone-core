import { service } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import { XTargetArray } from "@/lib/base/schema";
import { PageAll, companyTypes } from "@/lib/core/public/consts";
import { ResultType } from "@/network";

@service([KernelApi])
export default class CompanyService {
  readonly kernel: KernelApi;

  constructor(kernel: KernelApi) {
    this.kernel = kernel;
  }

  async queryCompanies(targetId: string): Promise<ResultType<XTargetArray>> {
    return await this.kernel.queryJoinedTargetById({
      id: targetId,
      typeNames: companyTypes,
      page: PageAll,
    });
  }
}
