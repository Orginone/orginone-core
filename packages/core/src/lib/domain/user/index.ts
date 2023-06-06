import { ServiceBuilder } from "@/di";
import UserService from "./UserService";
import UserModel from "./UserModel";
import { StateAction, createStore } from "@/state";
import { UserStore } from "@/lib/store/user";
import { IStorage } from "@/storage/Storage";

export function UserModule(builder: ServiceBuilder) {
  builder
    .constructorInject(UserService)
    .constructorInject(UserModel)
    .factory("UserStore", ctx => {
      const StoreClass = createStore<UserStore>({
        currentUser: null!
      }, "user");
      return new StoreClass(
        ctx.resolve<IStorage>("IStorage"), 
        ctx.resolve<StateAction>("StateAction")
      );
    });
}