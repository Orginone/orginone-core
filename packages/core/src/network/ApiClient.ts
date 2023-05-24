import { ResultType } from "@/lib/base/model";
import { RequestType } from "./request";
import { RequestMeta } from "./interceptor";

 
export type ClientType = "http" | "websocket";

export interface ApiClient<C extends ClientType = ClientType> {
  type: C;

  /**
   * 原始请求
   * @param methodName 请求方法名称
   * @param args 请求参数
   */
  request<T, A = any>(methodName: string, args: A, meta?: RequestMeta): Promise<T>;

  /**
   * 请求内核方法
   * @param req 内核请求参数
   */
  requestKernel<T = any>(req: RequestType, meta?: RequestMeta): Promise<ResultType<T>>;

  /**
   * 批量请求内核方法
   * @param req 内核请求参数的数组
   */
  requestKernelBatch(reqs: RequestType[], meta?: RequestMeta): Promise<ResultType<any>>;

}


export interface WebSocketClient extends ApiClient<"websocket"> {
  
}