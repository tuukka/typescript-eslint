import {
  TSESTreeOptions,
  EcmaVersion,
} from '@typescript-eslint/typescript-estree';

interface ParserOptions {
  comment?: boolean;
  ecmaFeatures?: {
    globalReturn?: boolean;
    jsx?: boolean;
  };
  ecmaVersion?: EcmaVersion;
  errorOnTypeScriptSyntacticAndSemanticIssues?: boolean;
  errorOnUnknownASTType?: boolean;
  extraFileExtensions?: string[];
  // ts-estree specific
  debugLevel?: TSESTreeOptions['debugLevel'];
  filePath?: string;
  loc?: boolean;
  noWatch?: boolean;
  project?: string | string[];
  projectFolderIgnoreList?: (string | RegExp)[];
  range?: boolean;
  sourceType?: 'script' | 'module';
  tokens?: boolean;
  tsconfigRootDir?: string;
  useJSXTextNode?: boolean;
  warnOnUnsupportedTypeScriptVersion?: boolean;
}

export { EcmaVersion, ParserOptions };
