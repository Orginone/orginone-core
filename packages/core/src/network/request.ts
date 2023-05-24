
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

export interface AccountRequestType<T = any> {
  /** 方法名称 */
  methodName: string;
  /** 参数 */
  data: T;
};

/** 桶支持的操作 */
export enum BucketOperates {
  List = 'List',
  Create = 'Create',
  Rename = 'Rename',
  Move = 'Move',
  Copy = 'Copy',
  Delete = 'Delete',
  Upload = 'Upload',
  AbortUpload = 'AbortUpload',
}

/** 桶操作携带的数据模型 */
export type BucketOperateModel = {
  /** 完整路径 */
  key: string;
  /** 名称 */
  name?: string;
  /** 目标 */
  destination?: string;
  /** 操作 */
  operate: BucketOperates;
  /** 携带的分片数据 */
  fileItem?: FileChunkData;
};

/** 上传文件携带的数据 */
export type FileChunkData = {
  /** 分片索引 */
  index: number;
  /** 文件大小 */
  size: number;
  /** 上传的唯一ID */
  uploadId: string;
  /** 分片数据 */
  data: number[];
  /** 分片数据编码字符串 */
  dataUrl: string;
};

/** 对象支持的操作 */
export enum ObjectOperates {
  Get = "Get",
  Set = "Set",
  Delete = "Delete",
}

/** 对象请求类型 */
export interface ObjectRequestType<T = any>  {
  /** 方法名称 */
  methodName: ObjectOperates;
  /** 对象 key */
  key: string;
  /** 域 */
  belongId: string;
  /** 数据 */
  data?: T;
}

export enum CollectionOperates {
  Insert = "Insert",
  Update = "Update",
  Remove = "Remove",
  Aggregate = "Aggregate"
}

/** 集合请求类型 */
export interface CollectionRequestType {
  /** 方法名称 */
  methodName: CollectionOperates;
  /** 集合名称 */
  collName: string;
  /** 域 */
  belongId: string;
  /** 新增、删除、修改、查询 */
  option: any
}