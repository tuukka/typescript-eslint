import { CatchClauseDefinition } from './CatchClauseDefinition';
import { ClassNameDefinition } from './ClassNameDefinition';
import { FunctionNameDefinition } from './FunctionNameDefinition';
import { ImplicitGlobalVariableDefinition } from './ImplicitGlobalVariableDefinition';
import { ImportBindingDefinition } from './ImportBindingDefinition';
import { ParameterDefinition } from './ParameterDefinition';
import { TSModuleNameDefinition } from './TSModuleNameDefinition';
import { TypeDefinition } from './TypeDefinition';
import { VariableDefinition } from './VariableDefinition';

type Definition =
  | CatchClauseDefinition
  | ClassNameDefinition
  | FunctionNameDefinition
  | ImplicitGlobalVariableDefinition
  | ImportBindingDefinition
  | ParameterDefinition
  | TSModuleNameDefinition
  | TypeDefinition
  | VariableDefinition;

export { Definition };
