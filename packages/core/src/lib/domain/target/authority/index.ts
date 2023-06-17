import { ServiceBuilder } from "@/di";
import AuthorityModel from "./AuthorityModel";
import AuthorityService from "./AuthorityService";

export function AuthorityModule(builder: ServiceBuilder) {
  builder.constructorInject(AuthorityModel).propertyInject(AuthorityService);
}
