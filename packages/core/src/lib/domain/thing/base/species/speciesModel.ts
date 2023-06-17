import { service } from "@/di";
import { XSpecies } from "@/lib/base/schema";
import { Repository } from "@/lib/model/ModelContext";

@service(["StateAction"])
export default class SpeciesModel extends Repository<XSpecies> {
  
}
