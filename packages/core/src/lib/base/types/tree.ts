
/**
 * 节点结构
 */
export interface XNode {
  id: string;
  parentId: string;
}

/**
 * 节点
 */
export class Node<T extends XNode> {
  readonly id: string;
  readonly parentId?: string;
  readonly children: Node<T>[];
  public data: T | undefined;

  constructor(id: string, parentId: string | undefined, data: T | undefined) {
    this.id = id;
    this.parentId = parentId;
    this.data = data;
    this.children = [];
  }

  public addChild(node: Node<T>) {
    this.children.push(node);
  }
}

/**
 * 树
 */
export class Tree<T extends XNode> {
  /**
   * root 顶级虚拟节点,
   * nodeMap 存储当前节点，
   * freeMap 存储游离的节点，
   * 处理先进来的子节点找不到父类的问题
   */
  readonly root: Node<T>;
  readonly nodeMap: Map<string, Node<T>>;
  private readonly freeMap: Map<string, Node<T>>;

  constructor(nodeData: T[]) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.root = new Node<T>("root", undefined, undefined);
    this.nodeMap = new Map<string, Node<T>>();
    this.freeMap = new Map<string, Node<T>>();
    nodeData.forEach((node) => this.addNode(node.id, node.parentId, node));
    this.clearFree();
  }

  /**
   * 加入节点
   * @param id 节点 ID
   * @param parentId 父节点 ID
   * @param data 节点数据
   */
  addNode(id: string, parentId: string, data: T | undefined) {
    if (id == null) return;
    if (this.nodeMap.has(id)) return;

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    let node: Node<T> = new Node<T>(id, parentId, data);
    if (!parentId) this.root.addChild(node);
    else {
      let parentNode: Node<T> | undefined = this.nodeMap.get(parentId);
      if (!parentNode) {
        this.freeMap.set(id, node);
      } else {
        parentNode.addChild(node);
      }
    }
    this.nodeMap.set(id, node);
  }

  /**
   * 清空游离的节点
   */
  clearFree() {
    if (this.freeMap.size !== 0) {
      let hasParent: string[] = [];
      this.freeMap.forEach((value, key, map) => {
        let freeNodeParentId: string = value.parentId!;
        if (this.nodeMap.has(freeNodeParentId)) {
          let parentNode: Node<T> = this.nodeMap.get(freeNodeParentId)!;
          parentNode.addChild(value);
          hasParent.push(key);
        }
      });
      hasParent.forEach((nodeKey) => this.freeMap.delete(nodeKey));
    }
  }
}
