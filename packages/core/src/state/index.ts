import { IObservable, ObservableAction } from "./Observable";
import { IState, StateAction } from "./State";


export interface StateProvider<S extends IState<any>, O extends IObservable> {
  name: string;
  state: StateAction<S>;
  notify: ObservableAction<O>;
}

export type AnyStateProvider = StateProvider<IState<any>, IObservable>;

export class StateImplementationHost {

  private _provider: AnyStateProvider | null = null;
  get provider() {
    if (!this._provider) {
      throw new TypeError("StateProvider is null");
    }
    return this._provider;
  }

  registerStateProvider(provider: AnyStateProvider) {
    if (this._provider) {
      throw new Error("StateProvider already registered");
    }
    this._provider = provider;
  }

  state<T>(initialValue: T): IState<T> {
    return this.provider.state.create(initialValue);
  }


}

export default new StateImplementationHost();