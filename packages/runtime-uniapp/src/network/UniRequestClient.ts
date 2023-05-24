import { service } from "@orginone/core/lib/di/decorator/service";
import { HttpRequestConfig, HttpClientBase, HttpMethod_Upper } from "@orginone/core/lib/network";
import { Store } from "@orginone/core/lib/state";
import { AuthorizationStore } from "@orginone/core/lib/lib/store/authorization";
import { AppConfig, ConfigurationManager } from "@orginone/core/lib/config";
import { ApiInterceptors, RequestMeta, ResponseInterceptor } from "@orginone/core/lib/network/interceptor";

@service(["Uni", ConfigurationManager, "ApiInterceptors"])
export class UniRequestClient extends HttpClientBase {
  constructor(
    uniInstance: UniNamespace.Uni, 
    config: ConfigurationManager<AppConfig>, 
    interceptors: ApiInterceptors,
  ) {
    super();
    this.uni = uniInstance;
    this.baseUrl = config.get("apiUrl");
    this.interceptors = interceptors;
  }

  private readonly uni: Uni;
  private readonly baseUrl: string;
  private readonly interceptors: ApiInterceptors;

  async httpRequest<T>(config: HttpRequestConfig, meta?: RequestMeta): Promise<T> {
    config = await this.applyRequestInterceptors(this.interceptors.request || [], config, meta);

    const option: UniNamespace.RequestOptions = {
      url: config.url,
      method: config.method.toUpperCase() as HttpMethod_Upper,
      header: config.header || {}
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
    option.url =  this.baseUrl + option.url;

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
    let data = await promise;

    data = await this.applyResponseInterceptors(this.interceptors.response || [], data, meta);
    return data;
  }

}