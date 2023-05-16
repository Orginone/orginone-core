import { ApiClient } from "./network";
import { ObservableAction } from "./state/Observable";
import { IState, StateAction } from "./state/State";
import { IStorage } from "./storage/Storage";


export interface ServiceProvider {
  name: string;

  state: StateAction<IState<any>>;
  // observe: ObservableAction<any>;
  storage: IStorage;
  api: ApiClient;
}


export class ServiceHost {

  private _provider: ServiceProvider | null = null;
  get provider() {
    if (!this._provider) {
      throw new TypeError("Provider is null");
    }
    return this._provider;
  }

  registerProvider(provider: ServiceProvider) {
    if (this._provider) {
      throw new Error("Provider already registered");
    }
    this._provider = provider;
  }

  state<T>(initialValue: T): IState<T> {
    return this.provider.state.create(initialValue);
  }

}

export default new ServiceHost();