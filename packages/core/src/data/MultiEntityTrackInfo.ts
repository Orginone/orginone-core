import { EntityState } from "./EntityState";


export interface AddOrRemoveTrackInfo {
  state: EntityState.Inserted | EntityState.Deleted;
}

export interface UpdateTrackInfo<P extends string = string> {
  state: EntityState.Modified;
  properties: P[];
}

export type EntityTrackInfo<P extends string = string> = AddOrRemoveTrackInfo | UpdateTrackInfo<P>;

export interface MultiEntityTrackInfo<T extends {}> {
  [id: string]: EntityTrackInfo<keyof T & string>;
}
