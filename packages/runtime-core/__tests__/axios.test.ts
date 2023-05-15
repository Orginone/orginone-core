import { test, describe, expect } from "@jest/globals";
import axiosStatic from "axios";
import { AxiosClient } from "../src/network/AxiosClient";
import AccountApi from "@orginone/core/lib/lib/api/account";

import { loadEnv } from "../../../env-polyfill";
import path from "path";

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


const state = {
  accessToken: ""
};
let client: AxiosClient = null!;


test("配置axios", () => {
  const axios = axiosStatic.create({
    timeout: 10 * 1000,
    baseURL: "http://orginone.cn:888/orginone"
  });

  client = new AxiosClient(axios);
});


test("测试登录", async () => {
  const api = new AccountApi(client);

  const res = await api.login(account, pwd);
  const data = res.data;

  expect(res.success).toEqual(true);

  state.accessToken = data.accessToken;
  expect(state.accessToken).toBeTruthy();

});