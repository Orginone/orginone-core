import { ServiceBuilder } from "@/di";
import SpeciesModel from "./speciesModel";
import SpeciesService from "./speciesService";

export function SpeciesModule(builder: ServiceBuilder) {
  builder.constructorInject(SpeciesModel).propertyInject(SpeciesService);
}
