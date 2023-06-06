import { XTarget } from "@/lib";
import { TargetType } from "@/lib/core/public/enums";
import { UserStore } from "@/lib/store/user";
import { IState, StateAction, Store } from "@/state";
import { ModelRoot } from "../../model/ModelContext";
import { ServiceContainer, service } from "@/di";
import UserService from "./UserService";

@service(["StateAction", UserService, "UserStore"])
export default class PersonModel implements ModelRoot<XTarget> {

  private readonly service: UserService;
  private readonly user: Store<UserStore>;

  private _companys: IState<XTarget[]>;
  get companys(): XTarget[] {
    return this._companys.value;
  }
  set companys(value: XTarget[]) {
    this._companys.value = value;
  }

  get root(): XTarget {
    return this.user.currentUser.value;
  }

  constructor(state: StateAction, service: UserService, user: Store<UserStore>) {
    this.service = service;
    this.user = user;
    this._companys = state.create([]);
  }

  async createModel(root: XTarget): Promise<void> {
    if (root.typeName != TargetType.Person) {
      throw new TypeError(`${root.name} 并不是一个人员`);
    }
    // UserModel比较特殊，root的值是别处来的
    // this.user.setCurrentUser(root);

    const data = await this.service.loadCompanys();
    this._companys.value = data;
  }

}