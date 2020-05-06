import { TSESTree } from '@typescript-eslint/experimental-utils';
import { VisitorBase, VisitorOptions } from './VisitorBase';
import {
  PatternVisitor,
  PatternVisitorCallback,
  PatternVisitorOptions,
} from './PatternVisitor';

class Visitor extends VisitorBase {
  public readonly options: VisitorOptions;
  constructor(visitor: VisitorBase | null, options: VisitorOptions) {
    super(visitor, options);
    this.options = options;
  }

  protected visitPattern(
    node: TSESTree.Node,
    callback: PatternVisitorCallback,
    options: PatternVisitorOptions = { processRightHandNodes: false },
  ): void {
    // Call the callback at left hand identifier nodes, and Collect right hand nodes.
    const visitor = new PatternVisitor(this.options, node, callback);

    visitor.visit(node);

    // Process the right hand nodes recursively.
    if (options.processRightHandNodes) {
      visitor.rightHandNodes.forEach(this.visit, this);
    }
  }
}

export { Visitor, VisitorBase, VisitorOptions };
