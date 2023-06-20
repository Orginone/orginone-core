import { service } from "@/di";
import { Xbase } from "@/lib/base/schema";
import { Repository, IndexType } from "@/lib/model/ModelContext";
import { StateAction } from "@/state";

export interface Relation extends Xbase {
  activeId: string;
  passiveId: string;
  typeName: RelationType;
}

export enum RelationType {
  Targets,
  TargetAuthority,
}

@service(["StateAction"])
export default class RelationModel extends Repository<Relation> {
  constructor(stateAction: StateAction) {
    super(stateAction);
    super.registerIndexing(
      (item: Relation) => this.itemKey(item),
      IndexType.Unique
    );
  }

  index(typeName: RelationType, activeId: string, passiveId: string): string {
    return typeName + "_" + activeId + "_" + passiveId;
  }

  itemKey(item: Relation): string {
    return this.index(item.typeName, item.activeId, item.passiveId);
  }

  hasRelation(
    typeName: RelationType,
    activeId: string,
    passiveId: string
  ): boolean {
    return super.has(this.index(typeName, activeId, passiveId));
  }

  removeByKey(typeName: RelationType, activeId: string, passiveId: string) {
    let removeKey = this.index(typeName, activeId, passiveId);
    this.removeFirst((item) => removeKey == this.itemKey(item));
  }

  getPassiveIdsByActiveId(type: RelationType, activeId: string): string[] {
    return this.data
      .filter((item) => item.activeId == activeId)
      .filter((item) => item.typeName == type)
      .map((item) => item.passiveId);
  }
}
