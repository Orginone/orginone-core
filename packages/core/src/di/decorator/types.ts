


export type Type = "design:type";
export type ParamTypes = "design:paramtypes";
export type ReturnType = "design:returntype";

export type DesignMetadata = Type | ParamTypes | ReturnType;

export enum DesignMetadatas {
  Type = "design:type",
  ParamTypes = "design:paramtypes",
  ReturnType = "design:returntype"
}