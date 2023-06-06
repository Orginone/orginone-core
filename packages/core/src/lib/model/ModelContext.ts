import type { ServiceContainer } from "@/di";


export interface ModelRoot<T extends {}>  {
  readonly root: T;
  createModel(root: T): Promise<void>;
}

export interface ModelCollection<T extends {}>  {
  readonly ref: string;
  readonly collection: T[];
  createModel(ref: string, collection: T[]): Promise<void>;
}