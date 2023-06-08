import "reflect-metadata";

import { test, describe, expect } from "@jest/globals";
import { AxiosClient } from "../src/network/AxiosClient";
import AccountApi from "@orginone/core/lib/lib/api/account";

import { loadEnv } from "../../../env-polyfill";
import path from "path";
import { App, OrginoneServices } from "@orginone/core";
import { AppConfig, ConfigurationManager } from "@orginone/core/lib/config";
import { ServiceBuilder } from "@orginone/core/lib/di";
import { FakeState, StateAction } from "@orginone/core/lib/state";
import { IStorage } from "@orginone/core/lib/storage/Storage";
import MemoryCacheStorage from "@orginone/core/lib/storage/MemoryCacheStorage";
import { ApiClient } from "@orginone/core/lib/network";

let account: string, pwd: string;

test("检查nodejs环境并加载env", () => {
  expect(typeof process).toEqual("object");
  expect(typeof process.env).toEqual("object");

  loadEnv(path.resolve(__dirname, "../"));

  // 测试用账号
  account = process.env.TEST_USER!;
  pwd = process.env.TEST_PWD!;

  expect(account).toBeTruthy();
  expect(pwd).toBeTruthy();
});

describe("node环境测试", () => {
  let app: App = null!;
  let config = new ConfigurationManager<AppConfig>();
  config.addConfig({
    apiUrl: "http://orginone.cn:888/orginone"
  });

  const builder = new ServiceBuilder()
    .use(OrginoneServices)
    .factory(ConfigurationManager<AppConfig>, ctx => config)
    .instance<StateAction>("StateAction", FakeState)
    .instance<IStorage>("IStorage", new MemoryCacheStorage())
    .constructorInject<ApiClient>(AxiosClient, "ApiClient");

  const services = builder.build();

  app = App.create({
    config,
    services
  });
  app.start();

  const api = services.resolve(AccountApi);

  test("测试登录", async () => {
    const res = await api.login(account, pwd);
    const data = res.data;
  
    expect(res.success).toEqual(true);
  });
})

