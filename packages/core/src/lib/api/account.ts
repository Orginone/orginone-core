
import { ApiClient } from '@/network';
import * as model from '../base/model';

/**
 * 奥集能账号api
 */
export default class KernelApi {

  private readonly client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * 登录到后台核心获取accessToken
   * @param userName 用户名
   * @param password 密码
   * @returns 异步登录结果
   */
  public async login(userName: string, password: string): Promise<model.ResultType<any>> {
    let res: model.ResultType<any>;
    let req = {
      account: userName,
      pwd: password,
    };
    
    res = await this.client.request('login', req);
    return res;
  }
  
  /**
   * 重置密码
   * @param userName 用户名
   * @param password 密码
   */
  public async resetPassword(
    userName: string,
    password: string,
    privatekey: string,
  ): Promise<model.ResultType<any>> {
    let res: model.ResultType<any>;
    let req = {
      account: userName,
      password: password,
      privateKey: privatekey,
    };
    res = await this.client.request('resetpassword', req);
    return res;
  }

  /**
   * 注册到后台核心获取accessToken
   * @param name 姓名
   * @param motto 座右铭
   * @param phone 电话
   * @param account 账户
   * @param password 密码
   * @param nickName 昵称
   * @returns {Promise<model.ResultType<any>>} 异步注册结果
   */
  public async register(params: model.RegisterType): Promise<model.ResultType<any>> {
    let res: model.ResultType<any> = await this.client.request('Register', params);
    return res;
  }

}
