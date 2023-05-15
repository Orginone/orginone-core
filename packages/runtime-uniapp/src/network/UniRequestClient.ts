import { HttpRequestConfig, HttpClientBase, HttpMethod_Upper } from "@orginone/core/lib/network";

export class UniRequestClient extends HttpClientBase {
  constructor(uniInstance: UniNamespace.Uni) {
    super();
    this.uni = uniInstance;
  }

  private readonly uni: Uni;

  async httpRequest<T>(config: HttpRequestConfig): Promise<T> {
    const option: UniNamespace.RequestOptions = {
      url: config.url,
      method: config.method.toUpperCase() as HttpMethod_Upper,
      header: config.header
    }
    if (option.method == "GET") {
      option.data = config.query;
    } else {
      option.data = config.body as any;
      if (config.query) {
        const prefix = config.url.includes("?") ? "&" : "?";
        const query = Object
          .entries(config.query)
          .map(([key, value]) => `${key}=` + encodeURIComponent(value))
          .join("&");
        option.url += prefix + query;
      }
    }
    let res = await this.uni.request(option);
    return res.data as T;
  }

}