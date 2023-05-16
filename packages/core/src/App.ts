
import { ServiceHost } from "./ServiceHost";
import { Dictionary } from "./types/base";
import { TinyEmitter } from "tiny-emitter";
export interface AppInit {
  root?: HTMLElement;
  services: ServiceHost;
}

export interface AppEventCallback {
  <S extends {}>(app: App<S>): Promise<any>;
}

export class App<S extends {} = Dictionary<any>> implements AppInit {
  /** 根DOM元素，仅在web端存在 */
  readonly root?: HTMLElement | undefined;
  readonly services: ServiceHost;
  state: S = {} as any;

  readonly emitter = new TinyEmitter();

  private static _instance: App;
  static get instance() {
    if (!App._instance) {
      throw new ReferenceError("No app instance");
    }
    return App._instance;
  }

  static create<S extends {}>(config: AppInit): App<S> {
    const app = new App<S>(config);
    App._instance  = app;

    return app;
  }

  private constructor(config: AppInit) { 
    this.root = config.root;
    this.services = config.services;
  }

  onAppStart(cb: AppEventCallback) {
    this.emitter.once("app-start", cb);
  }

  async start() {
    this.emitter.emit("app-start", this);
  }

  async dispose() {

  }
}
