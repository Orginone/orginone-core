import { XEntity, Xbase } from "../base/schema";

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

export class CollectionImpl<T extends Xbase> implements ModelCollection<T> {
  private _collection: T[] = [];
  private _index: { [id: string]: T } = {};

  get collection(): T[] {
    return this._collection;
  }

  get length(): number {
    return this._collection.length;
  }

  async createModel(collection: T[]): Promise<void> {
    this.clear();
    this._collection.push(...collection);
    this._collection.forEach((item) => this.insert(item));
  }

  getById(id: string): T | undefined {
    return this._index[id];
  }

  insert(item: T): void {
    this._collection.push(item);
    this._index[item.id] = item;
  }

  insertBatch(items: T[]): void {
    items.forEach((item) => this.insert(item));
  }

  removeById(id: string): T | undefined {
    let position = this._collection.findIndex((item) => item.id == id);
    let item = this.collection[position];
    this._collection.splice(position, 1);
    return item;
  }

  removeByIds(ids: string[]): void {
    ids.forEach((id) => this.removeById(id));
  }

  removeFirst(predicate: (value: T, index: number) => void): T | undefined {
    let position = this._collection.findIndex(predicate);
    let item = this.collection[position];
    this._collection.splice(position, 1);
    return item;
  }

  clear(): void {
    this._collection.splice(0, this.length);
  }
}
