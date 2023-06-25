import { service } from "@/di";
import { XAuthority } from "@/lib/base/schema";
import { Node, Tree } from "@/lib/base/types/tree";
import { Repository } from "@/lib/model/ModelContext";
import { StateAction } from "@/state";

@service(["StateAction"])
export default class AuthorityModel extends Repository<XAuthority> {
  constructor(stateAction: StateAction) {
    super(stateAction);
  }

  recursionInsert(belongId: string, authorities: XAuthority[]): void {
    this.removeByBelongId(belongId);
    for (let authority of authorities) {
      this.insert(authority);
      if (authority.nodes) {
        this.recursionInsert(belongId, authority.nodes);
      }
    }
  }

  removeByBelongId(belongId: string): void {
    this.removeWhere((item) => item.belongId == belongId);
  }

  getAuthorityByBelongId(belongId: string): XAuthority[] {
    return this.data.value.filter((item) => item.belongId == belongId);
  }

  tree(belongId: string): Node<XAuthority>[] {
    let authorities = this.getAuthorityByBelongId(belongId);
    let tree = new Tree<XAuthority>(authorities);
    return tree.root.children;
  }
}
