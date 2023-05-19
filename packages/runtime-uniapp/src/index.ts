import { ServiceBuilder } from "@orginone/core/lib/di/ServiceBuilder";
import { UniRequestClient } from "./network/UniRequestClient";
import UniStorage from "./storage/UniStorage";
import { ApiClient } from "@orginone/core/lib/network";
import { AppConfig, ConfigurationManager } from "@orginone/core/lib/config";
import { IStorage } from "@orginone/core/lib/storage/Storage";

/**
 * 使用为uni-app提供的默认实现环境
 * @param uniapp uniapp实例 
 */
export function useUniappRuntime(services: ServiceBuilder, uniapp: UniNamespace.Uni): ServiceBuilder {
  return services
    .instance("Uni", uniapp)
    .constructorInject<ApiClient>(UniRequestClient, "ApiClient")
    .constructorInject<IStorage>(UniStorage, "IStorage");
}