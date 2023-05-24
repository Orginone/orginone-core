
import { ResultType } from "@/lib/base/model";
import { ApiClient } from "./ApiClient";
import { Dictionary, JSONElementLike, JSONPrimitive } from "@/types/base";
import { AccountRequestType, BucketOperateModel, CollectionRequestType, ObjectOperates, ObjectRequestType, RequestType } from "./request";
import { RequestInterceptor, RequestMeta, ResponseInterceptor } from "./interceptor";
import { is } from "@/types/util";
import _ from "lodash";


export type HttpMethod_Upper = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS";
export type HttpMethod_Lower = Lowercase<HttpMethod_Upper>;
export type HttpMethod = HttpMethod_Lower | HttpMethod_Upper;

export interface HttpRequestConfig {
  url: string;
  method: HttpMethod;
  query?: Dictionary<any>;
  body?: JSONElementLike;
  header?: Dictionary<JSONPrimitive>;
}

export interface HttpClient extends ApiClient<"http"> {
  /**
   * 发送HTTP请求
   * @param config HTTP请求参数
   */
  httpRequest<T>(config: HttpRequestConfig, meta?: RequestMeta): Promise<T>;

  applyRequestInterceptors<T>(interceptors: RequestInterceptor<any>[], request: T, meta?: RequestMeta): Promise<T>;
  applyResponseInterceptors<T>(interceptors: ResponseInterceptor<any>[], response: T, meta?: RequestMeta): Promise<T>;
}


export interface HttpRequestMeta extends RequestMeta {
  fromQuery: string[];
}



export abstract class HttpClientBase implements HttpClient {

  type = "http" as const;
  abstract httpRequest<T>(config: HttpRequestConfig, meta?: RequestMeta): Promise<T>;

  request<T = ResultType<any>, A extends {} = Dictionary<any>>(url: string, args: A, meta?: RequestMeta): Promise<T> {
    let body: any = args;
    let query: Dictionary<any> = {};
    if (is<HttpRequestMeta>(meta, meta?.fromQuery)) {
      query = _.pick(args, ...meta.fromQuery);
      body = _.omit(args, ...meta.fromQuery);
    }
    return this.httpRequest({
      method: 'POST',
      url,
      body,
      query,
    }, meta);
  }

  requestAccount<T = any>(req: AccountRequestType<any>, meta?: RequestMeta | undefined): Promise<ResultType<T>> {
    return this.request("/kernel/rest/" + req.methodName, req.data, meta);
  }

  requestKernel<T = any>(req: RequestType, meta?: RequestMeta): Promise<ResultType<T>> {
    return this.request("/kernel/rest/request", req, meta);
  }

  requestKernelBatch(reqs: RequestType[], meta?: RequestMeta): Promise<ResultType<any>> {
    return this.request("/kernel/rest/requests", reqs, meta);
  }

  requestObject<T = any>(req: ObjectRequestType<any>): Promise<ResultType<T>> {
    let data: any = {};
    const url = '/anydata/Object/' + req.methodName + "/" + req.key;
    if (req.methodName == ObjectOperates.Set) {
      data = { operation: "replaceAll", data: { data: req.data } };
    }
    return this.request(url, data, {
      fromQuery: ["belongId"]
    } as HttpRequestMeta);
  }

  requestCollection<T = any>(req: CollectionRequestType): Promise<ResultType<T>> {
    const url = '/anydata/Collection/' + req.methodName + "/" + req.collName;
    return this.request(url, req.option, {
      fromQuery: ["belongId"]
    } as HttpRequestMeta);
  }

  requestBucket<T = any>(req: BucketOperateModel): Promise<ResultType<T>> {
    return this.request('/anydata/Bucket/Operate', req, {
      fromQuery: ["belongId"]
    } as HttpRequestMeta);
  }

  async applyResponseInterceptors<T>(interceptors: ResponseInterceptor[], response: T, meta?: RequestMeta): Promise<T> {
    const res = {
      value: response
    };
    for (const interceptor of interceptors) {
      const stop = await interceptor(res, meta);
      if (stop) {
        break;
      }
    }
    return res.value;
  }

  async applyRequestInterceptors<T>(interceptors: RequestInterceptor[], request: T, meta?: RequestMeta): Promise<T> {
    const req = {
      value: request
    };
    for (const interceptor of interceptors) {
      const stop = await interceptor(req, meta);
      if (stop) {
        break;
      }
    }
    return req.value;
  }

}