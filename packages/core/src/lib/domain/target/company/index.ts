import { ServiceBuilder } from "@/di";
import CompanyService from "./CompanyService";

export function CompanyModule(builder: ServiceBuilder) {
  builder.propertyInject(CompanyService);
}
