import { Subject } from 'rxjs';
import { ViewContainerRef } from '@angular/core';

export interface INgxBindIODirective {
  excludeIO: string[] | string;
  includeIO: string[] | string;
  excludeInputs: string[] | string;
  includeInputs: string[] | string;
  excludeOutputs: string[] | string;
  includeOutputs: string[] | string;

  innerComponent: any | undefined;
  hostComponent: any | undefined;
  inputs: {
    innerKeys: string[];
    hostKeys: string[];
  };
  outputs: {
    innerKeys: string[];
    hostKeys: string[];
  };

  usedInputs: { [key: string]: string } | undefined;
  usedOutputs: { [key: string]: string } | undefined;
  destroyed$: Subject<boolean>;

  viewContainerRef: ViewContainerRef;
  bindValue(key: string, value: any): void;
}
