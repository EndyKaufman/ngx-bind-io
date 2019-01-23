import { Subject } from 'rxjs';

export interface INgxBindIODirective {
  excludeInputs: string[] | string;
  includeInputs: string[] | string;
  excludeOutputs: string[] | string;
  includeOutputs: string[] | string;

  component: any;
  parentComponent: any;
  inputs: {
    keys: string[];
    parentKeys: string[];
  };
  outputs: {
    keys: string[];
    parentKeys: string[];
  };

  usedInputs?: { [key: string]: string };
  usedOutputs?: { [key: string]: string };
  destroyed$: Subject<boolean>;

  bindValue(key: string, value: any): void;
}
