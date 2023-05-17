import { HttpRequestConfig, HttpClientBase, HttpMethod_Upper } from "@orginone/core/lib/network";

export class UniRequestClient extends HttpClientBase {
  constructor(uniInstance: UniNamespace.Uni, baseUrl: string) {
    super();
    this.uni = uniInstance;
    this.baseUrl = baseUrl
  }

  private readonly uni: Uni;
  private readonly baseUrl: string;

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
    option.url =  option.url + this.baseUrl;
    let promise = new Promise<T>((resolve, reject) =>{
      this.uni.request({
        ...option,
        success: (res) => {
          resolve(res.data as T);
        },
        fail: (error) => {
          reject(error);
        }
      })
    })
    return await promise;
  }

}