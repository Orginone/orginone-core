import { service } from "@/di";
import { XTarget } from "@/lib/base/schema";
import { Repository } from "@/lib/model/ModelContext";

@service(["StateAction"])
export default class PersonModel extends Repository<XTarget> {
  
}
