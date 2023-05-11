export interface Dictionary<T> {
  [key: string]: T;
}
export interface ArrayLike<T> {
  readonly length: number;
  [index: number]: T;
}

export type JSONPrimitive = string | number | boolean;
export type JSONArray = ArrayLike<JSONElement>;
export type JSONObject = Dictionary<JSONElement>;
export type JSONElement = JSONPrimitive | JSONArray | JSONObject | null;
export type CanConvertToJSON = { toJSON(): JSONElementLike };
export type JSONElementLike = JSONElement | CanConvertToJSON;


export type AnyKey = keyof any;
export type AnyFunction = (...args: any[]) => any;
export type AnyObject = Record<AnyKey, any>;
export type PlainObject = Dictionary<any>;

