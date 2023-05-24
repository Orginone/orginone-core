import { ResultType } from "@/lib/base/model";
import { AccountRequestType, BucketOperateModel, CollectionRequestType, ObjectRequestType, RequestType } from "./request";
import { RequestMeta } from "./interceptor";
import { Dictionary } from "..";

 
export type ClientType = "http" | "websocket";

export interface ApiClient<C extends ClientType = ClientType> {
  type: C;

  /**
   * 原始请求
   * @param uri 请求方法名称
   * @param args 请求参数
   */
  request<T, A extends {} = Dictionary<any>>(uri: string, args: A, meta?: RequestMeta): Promise<T>;


  /**
   * 请求账号方法
   * @param req 请求参数
   */
  requestAccount<T = any>(req: AccountRequestType, meta?: RequestMeta): Promise<ResultType<T>>;

  //#region 内核API

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

  //#endregion


  //#region 对象存储API

  requestObject<T = any>(req: ObjectRequestType): Promise<ResultType<T>>;

  requestCollection<T = any>(req: CollectionRequestType): Promise<ResultType<T>>;

  requestBucket<T = any>(req: BucketOperateModel): Promise<ResultType<T>>;

  //#endregion

}


export interface WebSocketClient extends ApiClient<"websocket"> {
  
}