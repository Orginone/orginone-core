import { autowired } from "@/di";
import KernelApi from "@/lib/api/kernelapi";
import SpeciesModel from "../species/speciesModel";


export default class DirectoryService {
  @autowired(KernelApi)
  private readonly kernel: KernelApi = null!;

  @autowired(SpeciesModel)
  private readonly species: SpeciesModel = null!;

}