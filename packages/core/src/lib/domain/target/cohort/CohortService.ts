import { service } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import { XTargetArray } from "@/lib/base/schema";
import { PageAll, companyTypes } from "@/lib/core/public/consts";
import { TargetType } from "@/lib/core/public/enums";
import { ResultType } from "@/network";

@service([KernelApi])
export default class CohortService {
  readonly kernel: KernelApi;

  constructor(kernel: KernelApi) {
    this.kernel = kernel;
  }

  async queryCohorts(targetId: string): Promise<ResultType<XTargetArray>> {
    return await this.kernel.queryJoinedTargetById({
      id: targetId,
      typeNames: [TargetType.Cohort],
      page: PageAll,
    });
  }
}
