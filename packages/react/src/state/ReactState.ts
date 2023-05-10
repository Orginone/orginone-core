import { useState }from "react";
import type { IState, StateFactory } from "@orginone/core"


export interface ReactState<T> extends IState<T> {
  readonly __react_state__: true;
}

export const ReactStateFactory : StateFactory = {
  create<T>(initialValue: T): IState<T> {
    const state: ReactState<T> = { } as any;
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
  }
}