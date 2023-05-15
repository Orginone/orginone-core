import { Dictionary, JSONElement, JSONElementLike } from "@/types/base";
import { IStorage } from "./Storage";

/**
 * {@link IStorage}的默认实现，在内存中缓存键值对
 */
export default class MemoryCacheStorage implements IStorage {
  private _cache = new Map<string, JSONElementLike>();

  clear(): void {
    this._cache.clear();
  }
  getItem<T extends JSONElement>(key: string): T | null {
    return this._cache.get(key) as T;
  }
  removeItem(key: string): void {
    this._cache.delete(key);
  }
  setItem(key: string, value: JSONElementLike): void {
    this._cache.set(key, value);
  }

}