import "reflect-metadata";
import { ServiceBuilder } from "./di";
import { AuthorizationStore } from "./lib/store/authorization";
import { ApiInterceptors } from "./network/interceptor";
import { fixPageResult } from "./network/interceptors/PageResultHack";
import { createStore, StateAction, Store } from "./state";
import { IStorage } from "./storage/Storage";
import { useHttpAuthorization } from "./network/interceptors/Authorization";
import KernelApi from "./lib/api/kernelapi";
import AccountApi from "./lib/api/account";
import AnyStore from "./lib/api/anystore";
import { UserModule } from "./lib/domain/target/person";
import { CompanyModule } from "./lib/domain/target/company";
import { CohortModule } from "./lib/domain/target/cohort";
import { GroupModule } from "./lib/domain/target/group";
import { RelationModule } from "./lib/domain/target/relation";
import { AuthorityModule } from "./lib/domain/target/authority";

export * from "./App";
export * from "./errors";

export * from "./types/base";

// export * as state from "./state";
// export * as network from "./network";
// export * as storage from "./storage/Storage";

export function OrginoneServices(builder: ServiceBuilder) {
  return builder
    .constructorInject(KernelApi)
    .constructorInject(AccountApi)
    .constructorInject(AnyStore)
    .factory("AuthorizationStore", (ctx) => {
      const StoreClass = createStore<AuthorizationStore>(
        {
          accessToken: "",
        },
        "auth"
      );
      return new StoreClass(
        ctx.resolve<IStorage>("IStorage"),
        ctx.resolve<StateAction>("StateAction")
      );
    })
    .factory<ApiInterceptors>("ApiInterceptors", (ctx) => {
      return {
        request: [
          useHttpAuthorization(
            ctx.resolve<Store<AuthorizationStore>>("AuthorizationStore")
          ),
        ],
        response: [fixPageResult],
      };
    })
    .use(UserModule)
    .use(AuthorityModule)
    .use(RelationModule)
    .use(CompanyModule)
    .use(CohortModule)
    .use(GroupModule);
}
