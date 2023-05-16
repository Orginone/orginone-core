import { shallowRef, isShallow, ShallowRef } from "@vue/reactivity";
import type { IState, StateAction } from "@orginone/core/lib/state"


export const ShallowRefState : StateAction<ShallowRef<any>> = {
  create<T>(initialValue: T): IState<T> {
    return shallowRef<T>(initialValue);
  },
  is(state: IState<any>): state is ShallowRef<any> {
    return isShallow(state);
  },
}