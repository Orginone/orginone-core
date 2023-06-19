import { ServiceBuilder } from "@/di";
import CompanyModel from "./CompanyModel";
import CompanyService from "./CompanyService";

export function CompanyModule(builder: ServiceBuilder) {
  builder.constructorInject(CompanyModel).propertyInject(CompanyService);
}
