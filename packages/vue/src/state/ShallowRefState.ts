import { shallowRef }from "@vue/reactivity";
import type { IState, StateFactory } from "@orginone/core"


export const ShallowRefState : StateFactory = {
  create<T>(initialValue: T): IState<T> {
    return shallowRef<T>(initialValue);
  }
}