import { ServiceBuilder } from "@orginone/core/lib/di";
import { ComputedAction, StateAction } from "@orginone/core/lib/state";
import { ShallowRefState } from "./state/ShallowRefState";
import { ComputedRefState } from "./state/ComputedRefState";


export function VueState(services: ServiceBuilder): ServiceBuilder {
  return services
    .instance<StateAction>("StateAction", ShallowRefState)
    .instance<ComputedAction>("ComputedAction", ComputedRefState);
}