import type { ServiceContainer } from "./ServiceContainer";

export interface ServiceResolver<T> {
    (container: ServiceContainer): T;
}