import { IState, StateAction, isState } from "./State";
import { service } from "@/di/decorator/service";
import { IStorage } from "@/storage/Storage";

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

export interface StoreConstructor<S extends Store<any>> {
  new (storage: IStorage, state: StateAction): S;
}

export function createStore<S extends {}>(initState: S | StoreState<S>, name?: string): StoreConstructor<Store<S>> {
  name ||= "<global>";
  @service(["IStorage", "StateAction"]) 
  class StoreImpl {
    get ["[[Name]]"]() {
      return name;
    }
    private readonly _storage: IStorage;
    private readonly _state: StateAction;

    constructor(storage: IStorage, state: StateAction) {
      this._storage = storage;
      this._state = state;

      const ret: any = this;

      for (const key of Object.keys(initState)) {
        const persistKey = `${name}__[${key}]`;
        const setterKey = `set${key[0].toUpperCase()}${key.slice(1)}`;
  
        // 将值转为IState
        let value: IState<any> = (initState as any)[key];
        if (!isState(value)) {
          value = this._state.create(value);
        }
  
        // 初始化持久化的值
        const persistValue = this._storage.getItem(persistKey);
        if (persistValue != null) {
          value.value = persistValue;
        }
  
        // 创建setter方法
        const setValue = (v: any) => {
          ret[key].value = v;
          this._storage.setItem(persistKey, v);
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
    }

  };

  return StoreImpl as any;
}

 