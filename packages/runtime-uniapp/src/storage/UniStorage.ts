import { JSONElement, JSONElementLike } from "@orginone/core";
import { IStorage } from "@orginone/core/lib/storage/Storage";


export default class UniStorage implements IStorage {
  constructor(uniInstance: UniNamespace.Uni) {
    this.uni = uniInstance;
  }

  private readonly uni: Uni;

  clear(): void {
    this.uni.clearStorageSync();
  }
  getItem<T extends JSONElement>(key: string): T | null {
    return this.uni.getStorageSync(key);
  }
  removeItem(key: string): void {
    this.uni.removeStorageSync(key);
  }
  setItem(key: string, value: JSONElementLike): void {
    this.uni.setStorageSync(key, value);
  }

}