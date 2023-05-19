


import { App } from "@orginone/core";
import { registerServices } from "@orginone/core/lib/lib";
import MemoryCacheStorage from "@orginone/core/lib/storage/MemoryCacheStorage";
import { useUniappRuntime } from "../src";
import { test, expect, jest, describe } from "@jest/globals";
import { AppConfig, ConfigurationManager } from "@orginone/core/lib/config";
import { ServiceBuilder } from "@orginone/core/lib/di";
import { IStorage } from "@orginone/core/lib/storage/Storage";
import { AuthorizationStore } from "@orginone/core/lib/lib/store/authorization";
import { Store, FakeState, StateAction, IState } from "@orginone/core/lib/state";

function setImmediateAsync() {
  return new Promise<void>((s, e) => {
    setImmediate(() => {
      s();
    });      
  })
}

const request = jest.fn(async (param: any) => {
  return {
    data: {
      success: true,
      code: 200,
      data: []
    }
  };
})
const uni: any = {
  request
};

describe("uni-app环境测试", () => {

  let app: App = null!;
  let config = new ConfigurationManager<AppConfig>();
  config.addConfig({
    apiUrl: "http://orginone.cn:888/orginone"
  });

  const builder = new ServiceBuilder();
  registerServices(builder)
    .factory(ConfigurationManager<AppConfig>, ctx => config)
    .instance<StateAction>("StateAction", FakeState)
    .instance<IStorage>("IStorage", new MemoryCacheStorage())

  const services = builder.build();

  test("服务注册", () => {
    app = App.create({
      config,
      services
    });

    const storage = services.resolve<IStorage>("IStorage");
    expect(storage).toBeInstanceOf(MemoryCacheStorage);

    storage.setItem(`auth__[accessToken]`, "666")
  });


  test("应用初始化", async () => {

    const mockEvent = jest.fn(async () => {});
    app.onAppStart(mockEvent);
    

    await app.start();
    
    await setImmediateAsync();
    expect(mockEvent.mock.calls).toHaveLength(1);

    let store: Store<AuthorizationStore> = undefined!;
    expect(() => {
      store = services.resolve<Store<AuthorizationStore>>("AuthorizationStore");
    }).not.toThrow();
    expect(store).toBeDefined();

    expect(store).toHaveProperty("accessToken.value");
    expect(store.accessToken.value).toBe("666");

    store.setAccessToken("114514");
    expect(store.accessToken.value).toBe("114514");
  });


})


