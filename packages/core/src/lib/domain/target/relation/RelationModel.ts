import { XRelation } from "@/lib/base/schema";
import { CollectionImpl, IndexType } from "@/lib/model/ModelContext";

export default class RelationModel extends CollectionImpl<XRelation> {
  async createModel(collection: XRelation[]): Promise<void> {
    await super.createModel(collection);
    super.registerIndexing(this.itemKey, IndexType.Unique);
  }

  key(targetId: string, teamId: string): string {
    return targetId + "_" + teamId;
  }

  itemKey(item: XRelation): string {
    return this.key(item.targetId, item.teamId);
  }

  hasRelation(targetId: string, teamId: string): boolean {
    return super.has(this.key(targetId, teamId));
  }

  removeByKey(targetId: string, teamId: string) {
    let removeKey = this.key(targetId, teamId);
    this.removeFirst((item) => removeKey == this.itemKey(item));
  }

  getTeamIdsByTargetId(targetId: string): string[] {
    return this.collection
      .filter((item) => item.targetId == targetId)
      .map((item) => item.teamId);
  }
}
