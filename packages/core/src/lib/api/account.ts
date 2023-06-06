
import { ApiClient } from '@/network';
import * as model from '../base/model';
import { service } from '@/di/decorator/service';
import { AuthRequestMeta } from '@/network/interceptors/Authorization';
import { XTarget } from '../base/schema';

/**
 * 奥集能账号api
 */
@service(["ApiClient"])
export default class AccountApi {

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
  public async login(userName: string, password: string): Promise<model.ResultType<{
    accessToken: string;
    target: XTarget;
  }>> {
    let res: model.ResultType<any>;
    let req = {
      account: userName,
      pwd: password,
    };
    
    res = await this.client.requestAccount({
      methodName: 'login',
      data: req
    }, {
      allowAnonymous: true
    } as AuthRequestMeta);
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
    res = await this.client.requestAccount({
      methodName: 'resetpassword',
      data: req
    }, {
      allowAnonymous: true
    } as AuthRequestMeta);
    return res;
  }

  /**
   * 注册到后台核心获取accessToken
   * @param params 注册信息
   * @returns {Promise<model.ResultType<any>>} 异步注册结果
   */
  public async register(params: model.RegisterType): Promise<model.ResultType<any>> {
    let res: model.ResultType<any> = await this.client.requestAccount({
      methodName: 'Register',
      data: params
    }, {
      allowAnonymous: true
    } as AuthRequestMeta);
    return res;
  }

}
