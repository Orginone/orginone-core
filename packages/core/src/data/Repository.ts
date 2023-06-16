import { IState } from "@/state";
import { EntityState } from "./EntityState";
import { MultiEntityTrackInfo, EntityTrackInfo } from "./MultiEntityTrackInfo";

export interface Repository<T extends {}, K extends keyof T & string> {
  readonly data: IState<T[]>;

  /**
   * 新增实体
   * @param entity 实体
   */
  add(entity: T): Promise<any>;
  /**
   * 修改实体的字段
   * @param entity 实体
   */
  update(entity: T): Promise<any>;
  /**
   * add和update的组合
   * @param entity 实体
   */
  save(entity: T): Promise<any>;
  /**
   * 变更实体的一部分字段
   * @param id 实体的ID
   * @param part 要变更的一部分字段
   */
  patch(id: string, part: Partial<T>): Promise<any>;
  /**
   * 移除一个实体
   * @param entity 要移除的实体或者ID
   */
  remove(entityOrId: T | string): Promise<any>;
  /**
   * 根据ID查找实体
   * @param entity 要查找的ID
   * @returns 如果找到，则返回实体，否则返回`null`
   */
  find(id: string): Promise<T | null>;

  saveMany(entities: Iterable<T>): Promise<any>;
  removeMany(entities: Iterable<T>): Promise<any>;

  /**
   * 开始手动追踪变更，并且不执行实际的持久化
   */
  beginTrack(): void;
  /**
   * 手动追踪一个实体
   * @param entity 待追踪的实体
   * @param state 状态
   */
  track<P extends keyof T & string>(entity: T, state: EntityTrackInfo<P>): void;
  trackMany(entities: Iterable<T>, states: MultiEntityTrackInfo<T>): void;
  /**
   * 持久化所有手动追踪的修改
   */
  endTrack(): Promise<any>;
}

