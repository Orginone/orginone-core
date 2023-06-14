import "reflect-metadata";

import { test, describe, expect } from "@jest/globals";
import { AxiosClient } from "../src/network/AxiosClient";

import { loadEnv } from "../../../env-polyfill";
import path from "path";
import { App, OrginoneServices } from "@orginone/core";
import { AppConfig, ConfigurationManager } from "@orginone/core/lib/config";
import { ServiceBuilder } from "@orginone/core/lib/di";
import { FakeState, StateAction } from "@orginone/core/lib/state";
import { IStorage } from "@orginone/core/lib/storage/Storage";
import MemoryCacheStorage from "@orginone/core/lib/storage/MemoryCacheStorage";
import { ApiClient } from "@orginone/core/lib/network";
import UserModel from "@orginone/core/lib/lib/domain/target/user/UserModel";
import TargetService from "@orginone/core/lib/lib/domain/target/TargetService";
import UserService from "@orginone/core/lib/lib/domain/target/user/UserService";

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
    apiUrl: "https://orginone.cn/orginone",
  });

  const builder = new ServiceBuilder()
    .use(OrginoneServices)
    .factory(ConfigurationManager<AppConfig>, (ctx) => config)
    .instance<StateAction>("StateAction", FakeState)
    .instance<IStorage>("IStorage", new MemoryCacheStorage())
    .constructorInject<ApiClient>(AxiosClient, "ApiClient");

  const services = builder.build();

  app = App.create({
    config,
    services,
  });
  app.start();

  const userService = services.resolve(UserService);
  const userModel = services.resolve(UserModel);

  test("测试登录", async () => {
    await userService.login(account, pwd);
    let root = userModel.root;
    expect(!!root).toEqual(true);

    let companies = await userModel.loadCompanies();
    expect(companies.length > 0).toEqual(true);
  });
});
