
import { AppConfig, ConfigurationManager } from "./config";
import { ServiceContainer } from "./di";
import { Dictionary } from "./types/base";
import { TinyEmitter } from "tiny-emitter";
export interface AppInit {
  root?: HTMLElement;
  services: ServiceContainer;
  config: ConfigurationManager<AppConfig>;
}

export interface AppEventCallback {
  <S extends {}>(app: App): Promise<any>;
}

export class App implements AppInit {
  /** 根DOM元素，仅在web端存在 */
  readonly root?: HTMLElement | undefined;
  readonly services: ServiceContainer;
  readonly config: ConfigurationManager<AppConfig>;

  readonly emitter = new TinyEmitter();

  private static _instance: App;
  static get instance() {
    if (!App._instance) {
      throw new ReferenceError("No app instance");
    }
    return App._instance;
  }

  static create(config: AppInit): App {
    const app = new App(config);
    App._instance  = app;

    return app;
  }

  private constructor(config: AppInit) { 
    this.root = config.root;
    this.services = config.services;
    this.config = config.config;
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
