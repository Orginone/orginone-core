import { InOutRef } from "@/types/base";

/**
 * 请求拦截器
 */
export type RequestInterceptor<T = any>  =
  /**
   * 拦截请求内容，如果要阻止请求请抛异常
   * @param data 请求配置对象的InOutRef
   * @returns 是否短路（停止后续所有拦截器并开始请求）
   */
  (request: InOutRef<T>, meta?: RequestMeta) => Promise<boolean>;

/**
 * 响应拦截器
 */
export type ResponseInterceptor<T = any>  =
  /**
   * 拦截响应内容，如果要阻止响应请抛异常
   * @param data 接口返回对象的InOutRef
   * @returns 是否短路（停止后续所有拦截器并返回响应）
   */
  (response: InOutRef<T>, meta?: RequestMeta) => Promise<boolean>;


export interface RequestMeta {
  [key: string]: any;
}

export interface ApiInterceptors {
  request?: RequestInterceptor[];
  response?: ResponseInterceptor[];
}