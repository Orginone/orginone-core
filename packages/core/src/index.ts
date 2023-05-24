import "reflect-metadata";
import { ServiceBuilder } from "./di";
import { AuthorizationStore } from "./lib/store/authorization";
import { ApiInterceptors } from "./network/interceptor";
import { fixPageResult } from "./network/interceptors/PageResultHack";
import { createStore, StateAction } from "./state";
import { IStorage } from "./storage/Storage";

export * from "./App";
export * from "./errors";

export * from "./types/base";

// export * as state from "./state";
// export * as network from "./network";
// export * as storage from "./storage/Storage";

export function OrginoneServices(builder: ServiceBuilder) {
  return builder
    .factory<ApiInterceptors>("ApiInterceptors", ctx => {
      return {
        request: [],
        response: [
          fixPageResult
        ]
      }
    })
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