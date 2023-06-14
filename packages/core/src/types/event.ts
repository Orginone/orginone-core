import { AnyFunction } from "./base";

type AnyEmitOption = {
  [event: string]: AnyFunction;
}

type GetEventListener<T extends {}, K extends keyof T> = 
  T[K] extends (...args: infer A) => infer R 
    ? [(event: K, ...args: A) => R, A]
    : never;

export interface EventSource<T extends {} = AnyEmitOption> {
  emit<E extends keyof T & string>(event: E, ...args: GetEventListener<T, E>[1]): void;
}

export interface EventTarget<T extends {} = AnyEmitOption> {
  on<E extends keyof T & string>(event: E, listener: GetEventListener<T, E>[0]): any;
}