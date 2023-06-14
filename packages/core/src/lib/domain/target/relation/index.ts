import { ServiceBuilder } from "@/di";
import RelationService from "./RelationService";
import RelationModel from "./RelationModel";

export function RelationModule(builder: ServiceBuilder) {
  builder.constructorInject(RelationService).propertyInject(RelationModel);
}
