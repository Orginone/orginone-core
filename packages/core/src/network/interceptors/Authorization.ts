import { InOutRef } from "@/types/base";
import { HttpRequestConfig } from "../HttpClient";
import { RequestInterceptor, RequestMeta } from "../interceptor";
import { Store } from "@/state";
import { AuthorizationStore } from "@/lib/store/authorization";
import { is } from "@/types/util";

export interface AuthRequestMeta extends RequestMeta {
  /** 允许不登录发请求 */
  allowAnonymous?: boolean;
}

export function useHttpAuthorization(store: Store<AuthorizationStore>): RequestInterceptor<HttpRequestConfig> {
  return function(request: InOutRef<HttpRequestConfig>, meta?: RequestMeta) {
    if (!is<AuthRequestMeta>(meta, meta?.allowAnonymous)) {
      request.value.header ||= {};
      request.value.header["Authorization"] = store.accessToken.value;      
    }
    return Promise.resolve(false);
  }
}