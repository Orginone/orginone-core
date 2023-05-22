import { Constructor } from "@/types/base";
import { ServiceContainer } from "./ServiceContainer";
import { ServiceDescription, ServiceDescriptionMap, ServiceType } from "./ServiceDescription";
import { ServiceResolver } from "./ServiceResolver";
import { service } from "./decorator/service";
import { autowired } from "./decorator/autowired";
import { DesignMetadatas } from "./decorator/types";
import { Dictionary } from "@/types/base";
import { ServiceModule, ServicePlugin, ServiceRegister } from "./ServiceModule";


export class ServiceBuilder {
  
  private _serviceDefs: ServiceDescriptionMap = new Map();

  /**
   * 注册一个类
   * @param constructor 类的无参构造函数
   */
  class<T extends {}>(constructor: { new(): T }): this {
    this._serviceDefs.set(constructor, new ServiceDescription<T>(
      constructor,
      () => new constructor(),
      true
    ));
    return this;
  }

  /**
   * 注册一个采用构造函数注入的类，并且自动扫描依赖
   * @param constructor 类的构造函数，该类必须使用 {@link service} 装饰器
   * @param name 使用指定的名称而不是类本身来注册
   */
  constructorInject<T extends {}>(constructor: Constructor<T>, name?: string): this {
    const type = name || constructor;
    this._serviceDefs.set(type, new ServiceDescription<T>(
      type,
      this.createConstructorInjector(constructor),
      true
    ));
    return this;
  }

  /**
   * 注册一个采用属性注入的类，并且自动扫描所有标注了 {@link autowired} 装饰器的属性
   * @param constructor 类的无参构造函数
   * @param name 使用指定的名称而不是类本身来注册
   */
  propertyInject<T extends {}>(constructor: { new(): T }, name?: string): this {
    const type = name || constructor;
    this._serviceDefs.set(type, new ServiceDescription<T>(
      type,
      this.createPropertyInjector(constructor),
      true
    ));
    return this;
  }

  /**
   * 注册一个类型工厂
   * @param name 类型的名称或者类构造函数
   * @param factory 工厂方法
   */  
  factory<T extends {}>(type: ServiceType<T>, factory: ServiceResolver<T>): this {
    this._serviceDefs.set(type, new ServiceDescription<T>(
      type,
      factory,
      true
    ));
    return this;
  }

  /**
   * 注册一个单例
   * @param name 类型的名称
   * @param instance 实例，必须是对象
   */
  instance<T extends object>(name: string, instance: T): this {
    this._serviceDefs.set(name, new ServiceDescription<T>(
      name,
      () => instance,
      false
    ));
    return this;
  }

  /**
   * 使用自定义的注册方法
   * @param m 注册方法或者模块
   */
  use<C = any>(m: ServiceModule<C>, config?: C): this {
    let install: ServiceRegister<C> = m as any;
    if (typeof (m as ServicePlugin<C>).install === "function") {
      install = (m as ServicePlugin<C>).install;
    }
    install(this, config);
    return this;
  }

  public build() {
    const c: ServiceContainer = new (ServiceContainer as any)(this._serviceDefs);
    return c;
  }


  private createConstructorInjector<T extends {}>(constructor: Constructor<T>) {
    const types: ServiceType<T>[] | undefined = Reflect.getMetadata(DesignMetadatas.ParamTypes, constructor);
    if (!types) {
      throw new TypeError(`未定义类 ${constructor.name} 所需的依赖，无法注册`);
    }
    const factory: ServiceResolver<T> = (c) => {
      const params = types.map(t => c.resolve(t));
      return new constructor(...params);
    };
    return factory;
  }

  private createPropertyInjector<T extends {}>(constructor: Constructor<T>) {
    const props = Object.getOwnPropertyNames(constructor.prototype);
    const propertyMap: Dictionary<ServiceType<T>> = {};
    for (const prop of props) {
      const type: ServiceType<T> | undefined = Reflect.getMetadata(DesignMetadatas.Type, constructor.prototype, prop);
      if (type) {
        propertyMap[prop] = type;
      }
    }
    if (Object.keys(propertyMap).length == 0) {
      console.warn(`类 ${constructor.name} 没有可属性注入的依赖`);
    }

    const factory: ServiceResolver<T> = (c) => {
      const cls: any = new constructor();
      for (const [prop, t] of Object.entries(propertyMap)) {
        cls[prop] = c.resolve(t);
      }
      return cls as T;
    };
    return factory;
  }

}