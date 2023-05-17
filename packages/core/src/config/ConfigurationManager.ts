
import { PlatformNotSupportedError } from "@/errors";
import { Dictionary } from "@/types/base";


declare const process: { env: any };

export class ConfigurationManager<C extends {}> {
  private mergedConfig: Dictionary<any> = {};

  get root() {
    return this.mergedConfig;
  }


  addConfig(config: Partial<C>): this {
    this.mergedConfig = Object.assign(this.mergedConfig, config);
    return this;
  }

  addEnv(): this {
    if (typeof process !== "object" || typeof process.env !== "object") {
      throw new PlatformNotSupportedError("仅在nodejs环境支持env导入");
    }
    this.addConfig(process.env);
    return this;
  }

  get<K extends keyof C, T>(prop: K): C[K];
  get<T>(path: string): T | null {
    return this.mergedConfig[path] ?? null;
  }

}

export default new ConfigurationManager();