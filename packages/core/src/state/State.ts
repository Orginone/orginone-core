
export interface IState<T> {
  value: T;
}

export interface StateFactory {
  create<T>(initialValue: T): IState<T>;
}
