import { ServiceBuilder } from "@/di";
import GroupService from "./GroupService";

export function GroupModule(builder: ServiceBuilder) {
  builder.propertyInject(GroupService);
}
