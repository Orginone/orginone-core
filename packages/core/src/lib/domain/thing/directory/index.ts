import { ServiceBuilder } from "@/di";
import DirectoryModel from "./directoryModel";
import DirectoryService from "./directoryService";

export function SpeciesModule(builder: ServiceBuilder) {
  builder.constructorInject(DirectoryModel).propertyInject(DirectoryService);
}
