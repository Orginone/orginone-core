import { IState, StateAction } from "@/state";
import { Xbase } from "../base/schema";

export interface ModelRoot<T extends {}> {
  readonly root: T;
}

export enum IndexType {
  Unique,
}

export class Repository<T extends Xbase> {
  readonly data: IState<T[]>;
  private _uniqueIndexing: ((item: T) => string)[] = [];
  private _uniqueIndex: Map<string, T> = new Map();

  constructor(stateAction: StateAction) {
    this.data = stateAction.create([]);
    this.registerIndexing((item: T) => item.id, IndexType.Unique);
  }

  get length(): number {
    return this.data.value.length;
  }

  has(key: string): boolean {
    return this._uniqueIndex.has(key);
  }

  registerIndexing(indexing: (item: T) => string, indexType: IndexType): void {
    switch (indexType) {
      case IndexType.Unique:
        this._uniqueIndexing.push(indexing);
        break;
    }
  }

  checkUnique(item: T): boolean {
    for (let indexing of this._uniqueIndexing) {
      let key = indexing(item);
      if (this._uniqueIndex.has(key)) {
        return false;
      }
    }
    return true;
  }

  private uniquePush(item: T): void {
    this._uniqueIndexing.forEach((indexing) => {
      let key = indexing(item);
      this._uniqueIndex.set(key, item);
    });
  }

  private uniqueDelete(item: T): void {
    this._uniqueIndexing.forEach((indexing) => {
      let key = indexing(item);
      this._uniqueIndex.delete(key);
    });
  }

  getById(id: string): T | undefined {
    return this._uniqueIndex.get(id);
  }

  updateById(item: T): void {
    let old = this.getById(item.id);
    if (old) {
      Object.assign(old, item);
    }
  }

  insert(item: T): void {
    let success = this.checkUnique(item);
    if (success) {
      this.data.value.push(item);
      this.uniquePush(item);
    } else {
      this.updateById(item);
    }
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

  removeWhere(predicate: (value: T, index: number) => void): void {
    this.data.value = this.data.value.filter(predicate);
  }

  removeFirst(predicate: (value: T, index: number) => void): T | undefined {
    let position = this.data.value.findIndex(predicate);
    let item = this.data.value[position];
    if (item) {
      this.uniqueDelete(item);
      this.data.value.splice(position, 1);
      return item;
    }
  }

  clear(): void {
    this.data.value = [];
    this._uniqueIndex.clear();
  }
}
