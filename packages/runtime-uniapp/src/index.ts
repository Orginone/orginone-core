import { ServiceBuilder } from "@orginone/core/lib/di/ServiceBuilder";
import { UniRequestClient } from "./network/UniRequestClient";
import UniStorage from "./storage/UniStorage";

/**
 * 使用为uni-app提供的默认实现环境
 * @param uniapp uniapp实例 
 */
export function useUniappRuntime(services: ServiceBuilder, uniapp: UniNamespace.Uni): ServiceBuilder {
  return services
    .instance("Uni", uniapp)
    .constructorInject(UniRequestClient)
    .constructorInject(UniStorage);
}