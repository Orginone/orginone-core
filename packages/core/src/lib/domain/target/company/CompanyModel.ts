import { XTarget } from "@/lib/base/schema";
import { CollectionImpl } from "@/lib/model/ModelContext";

export default class CompanyModel extends CollectionImpl<XTarget> {
  get companies(): XTarget[] {
    return this.companies;
  }
}
