import { service } from "@/di";
import { XTarget } from "@/lib/base/schema";
import { CollectionImpl } from "@/lib/model/ModelContext";
import { IState, StateAction } from "@/state";

@service(["StateAction"])
export default class CompanyModel extends CollectionImpl<XTarget> {
  private _companies: IState<XTarget[]>;

  constructor(stateAction: StateAction){
    super()
    this._companies = stateAction.create([]);
  }
}
