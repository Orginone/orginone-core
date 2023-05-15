
export interface RequestType<M extends string = string, T = any> {
  /** 模块 */
  module: string;
  /** 方法 */
  action: M;
  /** 参数 */
  params: T;
};

/** 返回类型定义 */
export interface ResultType<T> {
  /** http代码 */
  code: number;
  /** 数据体 */
  data: T;
  /** 消息 */
  msg: string;
  /** 结果 */
  success: boolean;
};