import { ServiceBuilder } from "@/di";
import GroupModel from "./GroupModel";
import GroupService from "./GroupService";

export function GroupModule(builder: ServiceBuilder) {
  builder.propertyInject(GroupModel).propertyInject(GroupService);
}
