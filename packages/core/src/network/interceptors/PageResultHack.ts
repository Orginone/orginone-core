import { InOutRef } from "@/types/base";
import { RequestMeta, ResponseInterceptor } from "../interceptor";
import { ResultType, PageResult } from "../request";
import { is } from "@/types/util";

type Page = ResultType<PageResult<any>>;

interface PageRequestMeta extends RequestMeta {
  isPage?: boolean;
}

export const fixPageResult: ResponseInterceptor<Page> = function (response: InOutRef<Page>, meta?: RequestMeta)  {
  if (is<PageRequestMeta>(meta, meta?.isPage)) {
    // HACK: 当查询结果为空列表时，傻逼接口会丢失result字段，需要补上
    response.value.data.result ||= [];    
  }
  return Promise.resolve(false);
}