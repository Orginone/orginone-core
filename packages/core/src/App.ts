
import { ServiceHost } from "./ServiceHost";

export interface AppInit {
  root?: HTMLElement;
  services: ServiceHost;
}

export class App implements AppInit {
  /** 根DOM元素，仅在web端存在 */
  readonly root?: HTMLElement | undefined;
  readonly services: ServiceHost;

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
  }

  async start() {

  }

  async dispose() {

  }
}
