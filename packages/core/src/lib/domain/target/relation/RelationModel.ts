import { XRelation } from "@/lib/base/schema";
import { CollectionImpl } from "@/lib/model/ModelContext";

export default class RelationModel extends CollectionImpl<XRelation> {
  get relations(): XRelation[] {
    return this.collection;
  }

  private relationSets = new Set();

  itemKey(item: XRelation): string {
    return this.key(item.targetId, item.teamId);
  }

  key(targetId: string, teamId: string): string {
    return targetId + "_" + teamId;
  }

  insert(item: XRelation): void {
    let key: string = this.itemKey(item);
    if (this.relationSets.has(key)) {
      super.insert(item);
      this.relationSets.add(key);
    }
  }

  removeByKey(targetId: string, teamId: string) {
    let relation = this.removeFirst(
      (item) => item.targetId == targetId && item.teamId == teamId
    );
    if (relation) {
      this.relationSets.delete(this.itemKey(relation));
    }
  }

  removeById(id: string): XRelation | undefined {
    let item = super.removeById(id);
    if (item) {
      let key = this.itemKey(item);
      this.relationSets.delete(key);
    }
    return item;
  }

  clear(): void {
    super.clear();
    this.relationSets.clear();
  }

  getTeamIdsByTargetId(targetId: string): string[] {
    return this.collection
      .filter((item) => item.targetId == targetId)
      .map((item) => item.teamId);
  }
}
