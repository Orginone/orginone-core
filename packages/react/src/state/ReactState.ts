import { useState } from "react";
import type { IState, StateAction } from "@orginone/core"


export interface ReactState<T> extends IState<T> {
  readonly __react_state__: true;
}

export const ReactStateFactory : StateAction<ReactState<any>> = {
  create<T>(initialValue: T): IState<T> {
    const state: ReactState<T> = {} as any;
    const [value, setValue] = useState(initialValue);

    Object.defineProperty(state, "__react_state__", { value: true });
    Object.defineProperty(state, "value", {
      get() {
        return value;
      },
      set(v: T) {
        setValue(v);
      },
      enumerable: true
    });

    return state;
  },
  is(state: IState<any>): state is ReactState<any> {
    return (state as ReactState<any>).__react_state__;
  },
}