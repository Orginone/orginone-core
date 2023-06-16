import { Xbase } from "../base/schema";

export interface ModelRoot<T extends {}> {
  readonly root: T;
  createModel(root: T): Promise<void>;
}

export interface ModelCollection<T extends {}> {
  readonly collection: T[];
  readonly length: number;
  createModel(collection: T[]): Promise<void>;
  getById(id: string): T | undefined;
  insert(item: T): void;
  insertBatch(items: T[]): void;
  removeById(id: string): T | undefined;
  removeByIds(ids: string[]): void;
  clear(): void;
}

export enum IndexType {
  Unique,
  Normal,
}

export class CollectionImpl<T extends Xbase> implements ModelCollection<T> {
  private _collection: T[] = [];
  private _uniqueIndexing: ((item: T) => string)[] = [];
  private _uniqueIndex: Map<string, T> = new Map();
  private _normalIndexing: ((item: T) => string)[] = [];
  private _normalIndex: Map<String, T[]> = new Map();

  get collection(): T[] {
    return this._collection;
  }

  get length(): number {
    return this._collection.length;
  }

  has(key: string): boolean {
    return this._uniqueIndex.has(key);
  }

  async createModel(collection: T[]): Promise<void> {
    this._uniqueIndexing.push((item: T) => item.id);
    this.clear();
    collection.forEach((item) => this.insert(item));
  }

  registerIndexing(indexing: (item: T) => string, indexType: IndexType): void {
    switch (indexType) {
      case IndexType.Unique:
        this._uniqueIndexing.push(indexing);
        break;
      case IndexType.Normal:
        this._normalIndexing.push(indexing);
        break;
    }
  }

  checkUnique(item: T): void {
    this._uniqueIndexing.forEach((indexing) => {
      let key = indexing(item);
      if (this._uniqueIndex.has(key)) {
        console.log("错误对象：", item);
        throw new Error(`已存在键：${key}, 插入 Model 失败！`);
      }
    });
  }

  _uniquePush(item: T): void {
    this._normalIndexing.forEach((indexing) => {
      let key = indexing(item);
      if (!this._normalIndex.has(key)) {
        this._normalIndex.set(key, []);
      }
      this._normalIndex.get(key)?.push(item);
    });
  }

  _uniqueDelete(item: T): void {
    this._uniqueIndexing.forEach((indexing) => {
      let key = indexing(item);
      this._uniqueIndex.delete(key);
    });
  }

  _normalPush(item: T): void {
    this._normalIndexing.forEach((indexing) => {
      let key = indexing(item);
      if (!this._normalIndex.has(key)) {
        this._normalIndex.set(key, []);
      }
      this._normalIndex.get(key)?.push(item);
    });
  }

  _normalDelete(item: T): void {
    this._normalIndexing.forEach((indexing) => {
      let key = indexing(item);
      let arr = this._normalIndex.get(key);
      if (arr) {
        let position = arr.findIndex((i) => i.id == item.id);
        arr?.splice(position, 1);
      }
    });
  }

  getById(id: string): T | undefined {
    return this._uniqueIndex.get(id);
  }

  insert(item: T): void {
    this.checkUnique(item);
    this._collection.push(item);
    this._uniquePush(item);
    this._normalPush(item);
  }

  insertBatch(items: T[]): void {
    items.forEach((item) => this.insert(item));
  }

  removeById(id: string): T | undefined {
    return this.removeFirst((item) => item.id == id);
  }

  removeByIds(ids: string[]): void {
    ids.forEach((id) => this.removeById(id));
  }

  removeFirst(predicate: (value: T, index: number) => void): T | undefined {
    let position = this._collection.findIndex(predicate);
    let item = this.collection[position];
    if (item) {
      this._uniqueDelete(item);
      this._normalDelete(item);
      this._collection.splice(position, 1);
      return item;
    }
  }

  clear(): void {
    this._collection.splice(0, this.length);
    this._uniqueIndex.clear();
    this._normalIndex.clear();
  }
}
