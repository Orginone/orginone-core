import { IDisposable, IsAsyncInitialize } from "@/types/service";

import { ServiceDescription, ServiceDescriptionMap, ServiceType } from "./ServiceDescription";

export class ServiceContainer implements IDisposable {
  private _services: ServiceDescriptionMap;
  private _instances: WeakMap<ServiceDescription<any>, any> = new WeakMap();

  private constructor(services: ServiceDescriptionMap) {
    this._services = services;
  }

  resolve<T extends {}>(type: ServiceType<T>): T {
    const name = typeof type === "string" ? type : ("class " + type.name);
    const def = this._services.get(type);
    if (!def) {
        console.log(`${name}`);
        throw new Error(`未定义类型 ${name}`);
    }
    
    if (this._instances.has(def)) {
      return this._instances.get(def) as T;
    } else {
      let obj = def.factory(this) as T;
      this._instances.set(def, obj);
      return obj;
    }
  }

  async resolveInitialized<T extends {}>(type: ServiceType<T>) {
    const obj = this.resolve<T>(type);
    if (IsAsyncInitialize(obj)) {
      await obj.initializeAsync();
    }
    return obj;
  }

  dispose() {
    this._services = new Map();
    this._instances = new WeakMap();
  }
}