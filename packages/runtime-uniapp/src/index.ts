import { AppInit, App, ServiceProvider } from "@orginone/core";
import { ConfigurationManager, AppConfig } from "@orginone/core/lib/config";
import { UniRequestClient } from "./network/UniRequestClient";
import UniStorage from "./storage/UniStorage";
import { ShallowRefState } from "@orginone/vue/lib/ShallowRefState";

/**
 * 使用为uni-app提供的默认实现环境
 * @param uniapp uniapp实例 
 */
export function useUniappRuntime(uniapp: UniNamespace.Uni, config: ConfigurationManager<AppConfig>): ServiceProvider {
  return {
    name: "uniapp-vue",

    api: new UniRequestClient(uniapp, config.get("apiUrl")),
    storage: new UniStorage(uniapp),
    state: ShallowRefState
  };
}