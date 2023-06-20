import { service } from "@/di";
import { XSpecies } from "@/lib/base/schema";
import { Repository } from "@/lib/model/ModelContext";

@service(["StateAction"])
export default class SpeciesModel extends Repository<XSpecies> {
  recursionInsert(shareId: string, multiSpecies: XSpecies[]): void {
    this.removeByShareId(shareId);
    for (let species of multiSpecies) {
      this.insert(species);
      if (species.nodes) {
        this.recursionInsert(shareId, species.nodes);
      }
    }
  }

  removeByShareId(shareId: string): void {
    this.removeWhere((item) => item.shareId == shareId);
  }
}
