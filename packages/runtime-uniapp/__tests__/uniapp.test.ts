


import { App, ServiceHost } from "@orginone/core";
import { AppState, useAppEvents } from "@orginone/core/lib/lib";
import MemoryCacheStorage from "@orginone/core/lib/storage/MemoryCacheStorage";
import { useUniappRuntime } from "../src";
import { test, expect, jest, describe } from "@jest/globals";

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

  let app: App<AppState> = null!;

  test("服务注册", () => {
    app = App.create({
      services: new ServiceHost()
        .registerProvider(useUniappRuntime(uni))
        .useStorage(new MemoryCacheStorage())
        .build()
    });

    expect(() => app.services.provider).not.toThrow();
    expect(app.services.provider.storage).toBeInstanceOf(MemoryCacheStorage);

    app.services.provider.storage.setItem(`user__[accessToken]`, "666")
  });


  test("应用初始化", async () => {
    useAppEvents(app);

    const mockEvent = jest.fn(async () => {});
    app.onAppStart(mockEvent);
    

    await app.start();
    
    await setImmediateAsync();
    expect(mockEvent.mock.calls).toHaveLength(1);

    expect(app.state).toHaveProperty("user.accessToken");
    expect(app.state.user.accessToken).toBe("666")
  });


})


