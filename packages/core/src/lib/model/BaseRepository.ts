import { Xbase } from "@/lib/base/schema";
import { IAsyncInitialize } from "@/types/service";
import { Repository } from "../../data/Repository";
import { EntityTrackInfo, MultiEntityTrackInfo } from "@/data/MultiEntityTrackInfo";
import { IState } from "@/state";


export abstract class BaseRepository<T extends Xbase> implements
  Repository<T, "id">, IAsyncInitialize, AsyncIterable<T> {
  abstract readonly data: IState<T[]>;

  async *[Symbol.asyncIterator](){
    return this.getCollection();
  }

  async *getCollection() {
    yield null! as T;
  }

  add(entity: T): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(entity: T): Promise<any> {
    throw new Error("Method not implemented.");
  }
  save(entity: T): Promise<any> {
    if (!entity.id) {
      return this.add(entity);
    } else {
      return this.update(entity);
    }
  }
  async patch(id: string, part: Partial<T>): Promise<any> {
    let entity = await this.find(id);
    if (!entity) {
      throw new ReferenceError(`找不到实体 ${id}`);
    }
    entity = Object.assign(entity, part);
    return await this.update(entity);
  }
  remove(entityOrId: string | T): Promise<any> {
    throw new Error("Method not implemented.");
  }
  find(id: string): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  saveMany(entities: Iterable<T>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  removeMany(entities: Iterable<T>): Promise<any> {
    throw new Error("Method not implemented.");
  }


  beginTrack(): void {
    throw new Error("Method not implemented.");
  }
  track<P extends keyof T & string>(entity: T, state: EntityTrackInfo<P>): void {
    throw new Error("Method not implemented.");
  }
  trackMany(entities: Iterable<T>, states: MultiEntityTrackInfo<T>): void {
    throw new Error("Method not implemented.");
  }
  endTrack(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  isInitialized = false;
  initializeAsync(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
