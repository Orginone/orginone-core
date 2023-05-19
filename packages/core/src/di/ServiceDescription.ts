import { Constructor } from "@/types/base";
import { ServiceResolver } from "./ServiceResolver";


export type ServiceType<T extends {}> = string | Constructor<T>;
export type ServiceDescriptionMap = Map<ServiceType<any>, ServiceDescription<any>>;

export class ServiceDescription<T extends {}> {
    readonly type: ServiceType<T>;
    readonly factory: ServiceResolver<T>;
    readonly scoped: boolean;

    constructor(type: ServiceType<T>, factory: ServiceResolver<T>, scoped = false) {
        this.type = type;
        this.factory = factory;
        this.scoped = scoped;
    }
}
