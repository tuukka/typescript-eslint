import { TSESTree } from '@typescript-eslint/experimental-utils';
import { PatternVisitor } from '@typescript-eslint/scope-manager';
import baseRule from 'eslint/lib/rules/no-unused-vars';
import * as util from '../util';

export default util.createRule({
  name: 'no-unused-vars',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow unused variables',
      category: 'Variables',
      recommended: 'warn',
      extendsBaseRule: true,
    },
    schema: baseRule.meta.schema,
    messages: baseRule.meta.messages,
  },
  defaultOptions: [],
  create(context) {
    const rules = baseRule.create(context);

    return {
      ...rules,
      TSEmptyBodyFunctionExpression(node): void {
        node.params;
      },
      TSMappedType(node): void {
        // mapped types create a variable for their type name, but it's not necessary to reference it,
        // so we shouldn't consider it as unused for the purpose of this rule.
        context.markVariableAsUsed(node.typeParameter.name.name);
      },
      'TSEmptyBodyFunctionExpression, TSFunctionType, TSMethodSignature'(
        node:
          | TSESTree.TSEmptyBodyFunctionExpression
          | TSESTree.TSFunctionType
          | TSESTree.TSMethodSignature,
      ): void {
        // function type signature params create variables because they can be referenced within the signature,
        // but they obviously aren't unused variables for the purposes of this rule.
        for (const param of node.params) {
          visitPattern(param, name => {
            context.markVariableAsUsed(name.name);
          });
        }
      },
      [[
        'TSParameterProperty > AssignmentPattern > Identifier.left',
        'TSParameterProperty > Identifier.parameter',
      ].join(', ')](node: TSESTree.Identifier): void {
        // just assume parameter properties are used as property usage tracking is beyond the scope of this rule
        context.markVariableAsUsed(node.name);
      },
      ':matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression) > Identifier[name="this"].params'(
        node: TSESTree.Identifier,
      ): void {
        // this parameters should always be considered used as they're pseudo-parameters
        context.markVariableAsUsed(node.name);
      },
      TSEnumDeclaration(): void {
        // enum members create variables because they can be referenced within the enum,
        // but they obviously aren't unused variables for the purposes of this rule.
        const scope = context.getScope();
        for (const variable of scope.variables) {
          context.markVariableAsUsed(variable.name);
        }
      },

      // TODO
      '*[declare=true] Identifier'(node: TSESTree.Identifier): void {
        context.markVariableAsUsed(node.name);
        const scope = context.getScope();
        const { variableScope } = scope;
        if (variableScope !== scope) {
          const superVar = variableScope.set.get(node.name);
          if (superVar) {
            superVar.eslintUsed = true;
          }
        }
      },
    };

    function visitPattern(
      node: TSESTree.Node,
      cb: (node: TSESTree.Identifier) => void,
    ): void {
      const visitor = new PatternVisitor({}, node, cb);
      visitor.visit(node);
    }
  },
});
