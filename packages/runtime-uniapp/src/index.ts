import { AppInit, App, ServiceProvider } from "@orginone/core";
import { UniRequestClient } from "./network/UniRequestClient";
import UniStorage from "./storage/UniStorage";
import { ShallowRefState } from "@orginone/vue/lib/ShallowRefState";

/**
 * 使用为uni-app提供的默认实现环境
 * @param uniapp uniapp实例 
 */
export function useUniappRuntime(uniapp: UniNamespace.Uni): ServiceProvider {
  return {
    name: "uniapp-vue",

    api: new UniRequestClient(uniapp),
    storage: new UniStorage(uniapp),
    state: ShallowRefState
  };
}