import { service } from "@/di";
import { XTarget } from "@/lib/base/schema";
import { CollectionImpl } from "@/lib/model/ModelContext";
import { IState } from "@/state";

@service([])
export default class CompanyModel extends CollectionImpl<XTarget> {
//   private _companies: IState<XTarget[]>;

//   constructor(){

//   }
}
