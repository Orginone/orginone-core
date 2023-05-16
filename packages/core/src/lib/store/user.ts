import { BuiltServiceProvider } from "@/ServiceHost";

export function createUserStore(provider: BuiltServiceProvider) {
  return provider.store.create("user", {
    accessToken: ""
  });
}