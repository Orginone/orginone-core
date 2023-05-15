
import { ResultType } from "@/lib/base/model";
import { ApiClient } from "./ApiClient";
import { Dictionary, JSONElementLike, JSONPrimitive } from "@/types/base";
import { RequestType } from "./request";


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
  httpRequest<T>(config: HttpRequestConfig): Promise<T>;
}

export abstract class HttpClientBase implements HttpClient {
  
  type = "http" as const;
  abstract httpRequest<T>(config: HttpRequestConfig): Promise<T>;

  request<T = ResultType<any>, A = any>(methodName: string, args: A): Promise<T> {
    return this.httpRequest({
      method: 'post',
      url: '/kernel/rest/' + methodName,
      body: args as JSONElementLike,
    });
  }

  requestKernel<T = any>(req: RequestType): Promise<ResultType<T>> {
    return this.request("request", req);
  }

  requestKernelBatch(reqs: RequestType[]): Promise<ResultType<any>> {
    return this.request("requests", reqs);
  }

}