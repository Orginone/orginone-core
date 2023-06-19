import { ServiceBuilder } from "@/di";
import CohortModel from "./CohortModel";
import CohortService from "./CohortService";

export function CohortModule(builder: ServiceBuilder) {
  builder.constructorInject(CohortModel).propertyInject(CohortService);
}
