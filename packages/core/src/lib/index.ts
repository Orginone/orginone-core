import { Store, createStore } from "@/state/Store";
import { App } from "../App";
import { AuthorizationStore } from "./store/authorization";
import { ServiceBuilder } from "@/di";
import { IStorage } from "@/storage/Storage";
import { StateAction } from "@/state";


export function OrginoneServices(builder: ServiceBuilder) {
  return builder
    .factory("AuthorizationStore", ctx => {
      const StoreClass = createStore<AuthorizationStore>({
        accessToken: ""
      }, "auth");
      return new StoreClass(
        ctx.resolve<IStorage>("IStorage"), 
        ctx.resolve<StateAction>("StateAction")
      );
    });
}