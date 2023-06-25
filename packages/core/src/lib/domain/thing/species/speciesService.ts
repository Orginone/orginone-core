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

}
