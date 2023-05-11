 
export type ClientType = "http" | "websocket";

export interface ApiClient<T extends ClientType> {
  type: T;

}

export interface HttpClient extends ApiClient<"http"> {
  
}

export interface WebSocketClient extends ApiClient<"websocket"> {
  
}