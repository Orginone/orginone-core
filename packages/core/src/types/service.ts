/**
 * 对象资源可释放接口
 */
export interface IDisposable {
  dispose(): any;
}

export function isDisposable(obj: any): obj is IDisposable {
  return obj && typeof obj.dispose === "function";
}



export interface IAsyncInitialize {
  readonly isInitialized: boolean;
  initializeAsync(): Promise<void>;
}

export function IsAsyncInitialize(obj: any): obj is IAsyncInitialize {
  return obj && typeof obj.initializeAsync === "function";
}