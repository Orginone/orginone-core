import { autowired } from "@/di";
import { XRelation } from "@/lib/base/schema";
import RelationModel from "./RelationModel";

export default class RelationService {
  @autowired(RelationModel)
  private readonly relationModel: RelationModel = null!;

  generateRelations(targetId: string, teamIds: string[]): void {
    let relations = teamIds.map((teamId) => {
      return { targetId: targetId, teamId: teamId } as XRelation;
    });
    this.relationModel.insertBatch(relations);
  }

  breakRelations(targetId: string, teamId: string): void {
    this.relationModel.removeByKey(targetId, teamId);
  }
}
