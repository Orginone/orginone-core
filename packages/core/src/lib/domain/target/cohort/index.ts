import { ServiceBuilder } from "@/di";
import CohortService from "./CohortService";

export function CohortModule(builder: ServiceBuilder) {
  builder.propertyInject(CohortService);
}
