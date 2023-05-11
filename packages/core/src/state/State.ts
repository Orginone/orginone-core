
export interface IState<T> {
  value: T;
}

export interface StateAction<S extends IState<any>> {
  /**
   * 创建一个新的{@link IState<T>}
   * @template T 值的类型
   * @param initialValue 初始值
   */
  create<T>(initialValue: T): IState<T>;
  /**
   * 判断给定的{@link IState<T>}是否为当前注册的实现，并返回其具体实现的类型保护
   * @param state 要判断的IState
   */
  is(state: IState<any>): state is S;
}
