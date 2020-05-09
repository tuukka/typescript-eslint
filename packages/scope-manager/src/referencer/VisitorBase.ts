import {
  TSESTree,
  AST_NODE_TYPES,
  visitorKeys,
} from '@typescript-eslint/experimental-utils';

interface VisitorKeys {
  readonly [type: string]: ReadonlyArray<string> | undefined;
}
interface VisitorOptions {
  childVisitorKeys?: VisitorKeys | null;
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj != null;
}
function isNode(node: unknown): node is TSESTree.Node {
  return isObject(node) && typeof node.type === 'string';
}

type NodeVisitor = {
  [K in AST_NODE_TYPES]?: (node: TSESTree.Node) => void;
};

abstract class VisitorBase {
  readonly #childVisitorKeys: VisitorKeys;
  constructor(options: VisitorOptions) {
    this.#childVisitorKeys = options.childVisitorKeys ?? visitorKeys;
  }

  /**
   * Default method for visiting children.
   * When you need to call default visiting operation inside custom visiting
   * operation, you can use it with `this.visitChildren(node)`.
   */
  visitChildren(node: TSESTree.Node | null | undefined): void {
    if (node == null || node.type == null) {
      return;
    }

    const children = this.#childVisitorKeys[node.type] ?? Object.keys(node);
    for (const key of children) {
      const child = node[key as keyof TSESTree.Node] as unknown;
      if (!child) {
        continue;
      }

      if (Array.isArray(child)) {
        for (const subChild of child) {
          if (isNode(subChild)) {
            this.visit(subChild);
          }
        }
      } else if (isNode(child)) {
        this.visit(child);
      }
    }
  }

  /**
   * Dispatching node.
   */
  visit(node: TSESTree.Node | null | undefined): void {
    if (node == null || node.type == null) {
      return;
    }

    const visitor = (this as NodeVisitor)[node.type];
    if (visitor) {
      return visitor.call(this, node);
    }

    this.visitChildren(node);
  }
}

export { VisitorBase, VisitorOptions, VisitorKeys };
