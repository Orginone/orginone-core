import type { 
  ComputedState,
  ReadonlyComputedState, 
  WritableComputedState,  
  ComputedAction 
} from "@orginone/core/lib/state"
import { computed } from "@vue/reactivity";

export const ComputedRefState: ComputedAction = {
  create<T>(getter: () => T): ReadonlyComputedState<T> {
    const ref = computed(getter) as any;
    Object.defineProperty(ref, "isReadonly", {
      value: true
    });
    return ref as any;
  },
  createWritable<T>(getter: () => T, setter: (value: T) => any): WritableComputedState<T> {
    const ref = computed({
      get: getter,
      set: setter
    });
    Object.defineProperty(ref, "isReadonly", {
      value: false
    });
    return ref as any;
  }
}