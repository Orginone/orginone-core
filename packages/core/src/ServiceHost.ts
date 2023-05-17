import { AppConfig, ConfigurationManager } from "./config";
import { ApiClient } from "./network";
import { ObservableAction } from "./state/Observable";
import { IState, StateAction } from "./state/State";
import { StoreFactory, StoreImpl } from "./state/Store";
import { IStorage } from "./storage/Storage";


export interface ServiceProviderInfo {
  name: string;
}

export interface ServiceInfo {
  state: StateAction<IState<any>>;
  // observe: ObservableAction<any>;
  storage: IStorage;
  api: ApiClient;
}


export interface ServiceProvider extends ServiceInfo, ServiceProviderInfo {

}

export interface BuiltServiceProvider extends ServiceProvider {
  store: StoreFactory;
}

export class ServiceHost {

  private _provider: BuiltServiceProvider = {} as any;
  private built = false;
  get provider() {
    if (!this.built) {
      throw new TypeError("ServiceHost is not initialized");
    }
    return this._provider;
  }

  registerProvider(provider: ServiceProviderInfo & Partial<ServiceInfo>): this {
    this._provider = provider as any;
    return this;
  }

  useState(provider: StateAction<IState<any>>): this {
    this._provider.state = provider;
    return this;
  }

  useStorage(provider: IStorage): this {
    this._provider.storage = provider;
    return this;
  }

  useApi(provider: ApiClient): this {
    this._provider.api = provider;
    return this;
  }

  build(): this {
    if (!this._provider.name) {
      throw new Error("No registered provider");
    }
    if (!this._provider.api || !this._provider.storage || !this._provider.state) {
      throw new Error("Lack of required services");
    }

    this.built = true;

    this._provider.store = new StoreImpl(this);
    return this;
  }

}
