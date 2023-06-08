import { AppConfig, ConfigurationManager } from "@orginone/core/lib/config";
import { service } from "@orginone/core/lib/di";
import { HttpRequestConfig, HttpClientBase } from "@orginone/core/lib/network";
import { ApiInterceptors, RequestMeta } from "@orginone/core/lib/network/interceptor";
import AxiosStatic, { AxiosInstance } from "axios";

@service([ConfigurationManager, "ApiInterceptors"])
export class AxiosClient extends HttpClientBase {
  constructor(
    config: ConfigurationManager<AppConfig>, 
    interceptors: ApiInterceptors
  ) {
    super();
    const axios = AxiosStatic.create({
      baseURL: config.get("apiUrl")
    });
    this.axios = axios;
    this.interceptors = interceptors;
  }

  private readonly axios: AxiosInstance;
  private readonly interceptors: ApiInterceptors;

  async httpRequest<T>(config: HttpRequestConfig, meta?: RequestMeta): Promise<T> {
    config = await this.applyRequestInterceptors(this.interceptors.request || [], config, meta);

    let res = await this.axios.request<T>({
      url: config.url,
      method: config.method,
      params: config.query,
      data: config.body,
      headers: config.header
    });

    let data = res.data;
    data = await this.applyResponseInterceptors(this.interceptors.response || [], data, meta);
    return data;
  }

}