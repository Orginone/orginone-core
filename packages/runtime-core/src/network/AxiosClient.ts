import { HttpRequestConfig, HttpClientBase } from "@orginone/core/lib/network";
import _axios, { AxiosInstance } from "axios";

export class AxiosClient extends HttpClientBase {
  constructor(axios: AxiosInstance) {
    super();
    this.axios = axios;
  }

  private readonly axios: AxiosInstance;

  async httpRequest<T>(config: HttpRequestConfig): Promise<T> {
    let res = await this.axios.request<T>({
      url: config.url,
      method: config.method,
      params: config.query,
      data: config.body,
      headers: config.header
    });
    return res.data;
  }

}