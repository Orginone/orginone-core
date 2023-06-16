import { ServiceBuilder } from "@/di";
import RelationService from "./RelationService";
import RelationModel from "./RelationModel";

export function RelationModule(builder: ServiceBuilder) {
  builder.propertyInject(RelationService).propertyInject(RelationModel);
}
