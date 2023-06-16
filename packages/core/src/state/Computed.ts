import { IState } from "./State";

export interface ReadonlyComputedState<T> extends IState<T> {
  readonly isReadonly: true;
}
export interface WritableComputedState<T> extends IState<T> {
  readonly isReadonly: false;
}

export type ComputedState<T> = ReadonlyComputedState<T> | WritableComputedState<T>;

export interface ComputedAction {
  create<T>(getter: () => T): ReadonlyComputedState<T>;
  createWritable<T>(getter: () => T, setter: (value: T) => any): WritableComputedState<T>;
}