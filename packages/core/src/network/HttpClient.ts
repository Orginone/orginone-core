
import { ResultType } from "@/lib/base/model";
import { ApiClient } from "./ApiClient";
import { Dictionary, JSONElementLike, JSONPrimitive } from "@/types/base";
import { RequestType } from "./request";
import { RequestInterceptor, RequestMeta, ResponseInterceptor } from "./interceptor";


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

  applyResponseInterceptors<T>(interceptors: ResponseInterceptor<any>[], response: T): Promise<T>;
}

export abstract class HttpClientBase implements HttpClient {
  
  type = "http" as const;
  abstract httpRequest<T>(config: HttpRequestConfig, meta?: RequestMeta): Promise<T>;

  request<T = ResultType<any>, A = any>(methodName: string, args: A, meta?: RequestMeta): Promise<T> {
    return this.httpRequest({
      method: 'post',
      url: '/kernel/rest/' + methodName,
      body: args as JSONElementLike,
    }, meta);
  }

  requestKernel<T = any>(req: RequestType, meta?: RequestMeta): Promise<ResultType<T>> {
    return this.request("request", req, meta);
  }

  requestKernelBatch(reqs: RequestType[], meta?: RequestMeta): Promise<ResultType<any>> {
    return this.request("requests", reqs, meta);
  }

  async applyResponseInterceptors<T>(interceptors: ResponseInterceptor[], response: T): Promise<T> {
    const res = {
      value: response
    };
    for (const interceptor of interceptors) {
      const stop = await interceptor(res);
      if (stop) {
        break;
      }
    }
    return res.value;
  }

  async applyRequestInterceptors<T>(interceptors: RequestInterceptor[], request: T): Promise<T> {
    const res = {
      value: request
    };
    for (const interceptor of interceptors) {
      const stop = await interceptor(res);
      if (stop) {
        break;
      }
    }
    return res.value;
  }

}