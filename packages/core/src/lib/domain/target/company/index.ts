import { ServiceBuilder } from "@/di";
import CompanyModel from "./CompanyModel";

export function CompanyModule(builder: ServiceBuilder) {
  builder.constructorInject(CompanyModel);
}
