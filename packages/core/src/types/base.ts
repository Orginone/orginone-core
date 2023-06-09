export interface Dictionary<T> {
  [key: string]: T;
}
export interface ArrayLike<T> {
  readonly length: number;
  [index: number]: T;
}

export type JSONPrimitive = string | number | boolean;
export type JSONArray = Array<JSONElement>;
export type JSONObject = Dictionary<JSONElement>;
/** 可以序列化和反序列化为JSON的类型 */
export type JSONElement = JSONPrimitive | JSONArray | JSONObject | null;

/** 只能序列化，但不能反序列化为JSON的类型 */
export interface JSONObjectLike { 
  toJSON(): JSONElementLike 
};
export type JSONArrayLike = ArrayLike<JSONElementLike>;
export type JSONElementLike = JSONElement | JSONObjectLike | JSONArrayLike;


export type AnyKey = keyof any;
export type AnyFunction = (...args: any[]) => any;
export type AnyObject = Record<AnyKey, any>;
export type PlainObject = Dictionary<any>;
export interface Constructor<T extends {}> {
  new(...args: any[]): T;
}


/** 将一个对象的属性名都转成大写 */
export type Uppercased<T extends {}> = {
  [P in (keyof T & string) as Uppercase<P>]: T[P]
}

/** 将一个对象的属性名都转成小写 */
export type Lowercased<T extends {}> = {
  [P in (keyof T & string) as Lowercase<P>]: T[P]
}

/** 按引用输出参数，离开方法作用域前，必须要对value赋值 */
export interface OutRef<T> {
  value: T | null;
}
/** 按引用输入参数，值是只读的 */
export interface InRef<T> {
  readonly value: T;
}
/** 按引用传递参数，值可以被修改 */
export interface InOutRef<T> {
  value: T;
}