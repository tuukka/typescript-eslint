import {
  TSESTree,
  EcmaVersion,
  visitorKeys,
} from '@typescript-eslint/typescript-estree';
import { Referencer, ReferencerOptions } from './referencer';
import { ScopeManager } from './ScopeManager';

interface AnalyzeOptions {
  /**
   * Whether the whole script is executed under node.js environment.
   * When enabled, the scope manager adds a function scope immediately following the global scope.
   */
  globalReturn?: boolean;

  /**
   * Implied strict mode (if ecmaVersion >= 5).
   */
  impliedStrict?: boolean;

  /**
   * The source type of the script.
   */
  sourceType?: 'script' | 'module';

  /**
   * Which ECMAScript version is considered
   */
  ecmaVersion?: EcmaVersion;

  /**
   * Known visitor keys.
   */
  childVisitorKeys?: ReferencerOptions['childVisitorKeys'];
}

const DEFAULT_OPTIONS: AnalyzeOptions = {
  globalReturn: false,
  impliedStrict: false,
  sourceType: 'script',
  ecmaVersion: 2018,
  childVisitorKeys: visitorKeys,
};

/**
 * Takes an AST and returns the analyzed scopes.
 */
function analyze(
  tree: TSESTree.Node,
  providedOptions?: AnalyzeOptions,
): ScopeManager {
  const options = Object.assign({}, DEFAULT_OPTIONS, providedOptions);
  const scopeManager = new ScopeManager(options);
  const referencer = new Referencer(options, scopeManager);

  referencer.visit(tree);

  return scopeManager;
}

export { analyze, AnalyzeOptions };
