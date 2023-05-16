import { App } from "@/App";
import { IState, isState } from "./State";
import { ServiceHost, ServiceProvider } from "../ServiceHost";

export type StoreState<S extends {}> = {
  readonly [K in keyof S & string]: S[K] extends IState<any> ? S[K] : IState<S[K]>;
}

export type StoreAction<S extends {}> = {
  [K in keyof S & string as `set${Capitalize<K>}`]: (payload: S[K]) => any;
}

/**
 * 一种可以自动持久化的{@link IState}的聚集，必须通过固定的更新方法来修改值
 */
export type Store<S extends {}> = StoreState<S> & StoreAction<S>;

export interface StoreFactory {
  create<S extends {}>(name: string, initState: S | StoreState<S>): Store<S>;
}

export class StoreImpl implements StoreFactory {

  private readonly service: ServiceProvider;
  constructor(service: ServiceHost) {
    this.service = service.provider;
  }

  create<S extends {}>(name: string, initState: S | StoreState<S>): Store<S> {
    if (!name || !name.length) {
      throw new ReferenceError("name is required");
    }
    const ret = {
      get "[[Name]]"() {
        return name;
      }
    } as any;

    for (const key of Object.keys(initState)) {
      const persistKey = `${name}__[${key}]`;
      const setterKey = `set${key[0].toUpperCase()}${key.slice(1)}`;

      // 将值转为IState
      let value: IState<any> = (initState as any)[key];
      if (!isState(value)) {
        value = this.service.state.create(value);
      }

      // 初始化持久化的值
      const persistValue = this.service.storage.getItem(persistKey);
      if (persistValue != null) {
        value.value = persistValue;
      }

      // 创建setter方法
      const setValue = (v: any) => {
        ret[key] = v;
        this.service.storage.setItem(persistKey, v);
      };

      Object.defineProperty(ret, key, {
        value,
        enumerable: true
      });
      Object.defineProperty(ret, setterKey, {
        value: setValue,
        enumerable: true
      });
    }


    return ret;
  }
  
}