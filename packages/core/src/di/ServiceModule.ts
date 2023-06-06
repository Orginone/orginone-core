import { ServiceBuilder } from "./ServiceBuilder";

export interface ServiceRegister<C> {
  (builder: ServiceBuilder): any;
  (builder: ServiceBuilder, config: C): any;
}

export interface ServicePlugin<C> {
  install: ServiceRegister<C>;
}

export type ServiceModule<C> = ServiceRegister<C> | ServicePlugin<C>;