import { service } from "@/di";
import { XAuthority } from "@/lib/base/schema";
import { Repository } from "@/lib/model/ModelContext";
import { StateAction } from "@/state";

@service(["StateAction"])
export default class AuthorityModel extends Repository<XAuthority> {
  constructor(stateAction: StateAction) {
    super(stateAction);
  }

  recursionInsert(authorities: XAuthority[]): void {
    for (let authority of authorities) {
      this.insert(authority);
      if (authority.nodes) {
        this.recursionInsert(authority.nodes);
      }
    }
  }

  tree(belongId: string): XAuthority[] {
    let items = this.data.filter((item) => item.belongId == belongId);

    return [];
  }
}
