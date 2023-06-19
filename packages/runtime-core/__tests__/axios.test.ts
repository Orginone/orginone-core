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
import UserModel from "@orginone/core/lib/lib/domain/target/person/UserModel";
import PersonService from "@orginone/core/lib/lib/domain/target/person/PersonService";
import CompanyModel from "@orginone/core/lib/lib/domain/target/company/CompanyModel";
import CompanyService from "@orginone/core/lib/lib/domain/target/company/CompanyService";
import CohortModel from "@orginone/core/lib/lib/domain/target/cohort/CohortModel";
import CohortService from "@orginone/core/lib/lib/domain/target/cohort/CohortService";

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

  const userService = services.resolve(PersonService);
  const user = services.resolve(UserModel);
  const companyService = services.resolve(CompanyService);
  const companies = services.resolve(CompanyModel);
  const cohortService = services.resolve(CohortService);
  const cohorts = services.resolve(CohortModel);

  test("测试登录", async () => {
    await userService.login(account, pwd);
    expect(!!user.root).toEqual(true);
  });

  test("身份加载", async () => {
    await userService.loadGivenIdentities();
    expect(user.givenIdentities.length > 0).toEqual(true);
  });

  test("加载单位", async () => {
    await companyService.loadUserCompanies();
    let targetIds = companies.getCompaniesByTargetId(user.root.id);
    expect(targetIds.length).toEqual(companies.length);
  });

  test("加载单位的群组", async () => {
    for (let company of companies.data) {
      let length = await cohortService.loadCohorts(company.id);
      let companyCohorts = cohorts.getCohortsByTargetId(company.id);
      expect(companyCohorts.length).toEqual(length);
    }
  });
});
