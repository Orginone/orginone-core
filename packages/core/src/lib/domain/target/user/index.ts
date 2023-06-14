import { ServiceBuilder } from "@/di";
import { StateAction, createStore } from "@/state";
import { UserStore } from "@/lib/store/user";
import { IStorage } from "@/storage/Storage";
import UserService from "./UserService";
import UserModel from "./UserModel";
import { XTarget } from "@/lib/base/schema";

export function UserModule(builder: ServiceBuilder) {
  builder
    .constructorInject(UserService)
    .propertyInject(UserModel)
    .factory("UserStore", (ctx) => {
      const StoreClass = createStore<UserStore>(
        {
          currentUser: {} as XTarget,
        },
        "user"
      );
      return new StoreClass(
        ctx.resolve<IStorage>("IStorage"),
        ctx.resolve<StateAction>("StateAction")
      );
    });
}
