import { ServiceType } from "../ServiceDescription";
import { DesignMetadatas } from "./types";

/**
 * 指定属性通过注入获得值
 * @param type 手动指定注入的类型，仅在存在接口的情况下使用。不传默认会根据设计时类型信息读取
 * @returns
 */

export function autowired(type?: ServiceType<any>): PropertyDecorator {
  if (type) {
    return Reflect.metadata(DesignMetadatas.Type, type);
  } else {
    return function () {
      // 什么都不做
    };
  }
}
