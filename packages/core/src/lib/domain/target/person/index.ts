import { ServiceBuilder } from "@/di";
import { StateAction, createStore } from "@/state";
import { UserStore } from "@/lib/store/user";
import { IStorage } from "@/storage/Storage";
import PersonService from "./PersonService";
import PersonModel from "./UserModel";
import { XTarget } from "@/lib/base/schema";

export function UserModule(builder: ServiceBuilder) {
  builder
    .constructorInject(PersonModel)
    .propertyInject(PersonService)
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
