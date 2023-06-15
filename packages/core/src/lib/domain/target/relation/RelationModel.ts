import { XRelation } from "@/lib/base/schema";
import { CollectionImpl } from "@/lib/model/ModelContext";

export default class RelationModel extends CollectionImpl<XRelation> {
  private _joinIndex = new Set();

  key(targetId: string, teamId: string): string {
    return targetId + "_" + teamId;
  }

  has(targetId: string, teamId: string): boolean {
    return this._joinIndex.has(this.key(targetId, teamId));
  }

  itemKey(item: XRelation): string {
    return this.key(item.targetId, item.teamId);
  }

  insert(item: XRelation): void {
    let key: string = this.itemKey(item);
    if (this._joinIndex.has(key)) {
      super.insert(item);
      this._joinIndex.add(key);
    }
  }

  removeByKey(targetId: string, teamId: string) {
    let relation = this.removeFirst(
      (item) => item.targetId == targetId && item.teamId == teamId
    );
    if (relation) {
      this._joinIndex.delete(this.itemKey(relation));
    }
  }

  removeById(id: string): XRelation | undefined {
    let item = super.removeById(id);
    if (item) {
      let key = this.itemKey(item);
      this._joinIndex.delete(key);
    }
    return item;
  }

  clear(): void {
    super.clear();
    this._joinIndex.clear();
  }

  getTeamIdsByTargetId(targetId: string): string[] {
    return this.collection
      .filter((item) => item.targetId == targetId)
      .map((item) => item.teamId);
  }
}
