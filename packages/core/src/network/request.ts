
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

/** 分页返回定义 */
export interface PageResult<T> {
  /** 偏移量 */
  offset: number;
  /** 最大数量 */
  limit: number;
  /** 总数 */
  total: number;
  /** 结果 */
  result: T[];
}