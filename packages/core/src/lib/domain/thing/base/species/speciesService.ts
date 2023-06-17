import { autowired } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import { TargetType } from "@/lib/base/enums";
import { XTarget } from "@/lib/base/schema";
import SpeciesModel from "./speciesModel";

export default class SpeciesService {
  @autowired(KernelApi)
  private readonly kernel: KernelApi = null!;

  @autowired(SpeciesModel)
  private readonly species: SpeciesModel = null!;

  async loadSpecies(target: XTarget): Promise<void> {
    const res = await this.kernel.querySpeciesTree({
      id: target.id,
      upTeam: target.typeName === TargetType.Group,
      belongId: target.belongId,
      filter: "",
    });
    if (res.success) {
      let data = res.data.result || [];
      this.species.removeByIds(data.map((item) => item.id));
      this.species.insertBatch(data);
    }
  }
}
