import { Injectable } from '@angular/core';
import { INgxBindIODirective } from '../interfaces/ngx-bind-io-directive.interface';
import {
  removeKeysManualBindedInputs,
  removeKeysUsedInAttributes,
  removeKeysManualBindedOutputs
} from '../utils/components-utils';
import { NgxBindInputsService } from './ngx-bind-inputs.service';

@Injectable()
export class NgxBindIODebugService {
  constructor(private _ngxBindInputsService: NgxBindInputsService) { }
  showDebugInfo(directive: Partial<INgxBindIODirective>, debug: boolean) {
    let notExistsOutputs: string[] = [];
    let notExistsInputs: string[] = [];
    if (
      directive.outputs &&
      directive.innerComponent &&
      directive.innerComponent.__proto__ &&
      directive.innerComponent.__proto__.constructor &&
      directive.innerComponent.__proto__.constructor.ngBaseDef &&
      directive.innerComponent.__proto__.constructor.ngBaseDef.outputs
    ) {
      const ngBaseDefOutputs = Object.keys(directive.innerComponent.__proto__.constructor.ngBaseDef.outputs);
      notExistsOutputs = removeKeysManualBindedOutputs(
        directive,
        removeKeysUsedInAttributes(directive, ngBaseDefOutputs)
      ).filter(ngBaseDefOutput => directive.outputs.innerKeys.indexOf(ngBaseDefOutput) === -1);
    }
    if (
      directive.inputs &&
      directive.innerComponent &&
      directive.innerComponent.__proto__ &&
      directive.innerComponent.__proto__.constructor &&
      directive.innerComponent.__proto__.constructor.ngBaseDef &&
      directive.innerComponent.__proto__.constructor.ngBaseDef.inputs
    ) {
      const ngBaseDefInputs = Object.keys(directive.innerComponent.__proto__.constructor.ngBaseDef.inputs);
      notExistsInputs = removeKeysManualBindedInputs(
        directive,
        removeKeysUsedInAttributes(directive, ngBaseDefInputs)
      ).filter(ngBaseDefInput => directive.inputs.innerKeys.indexOf(ngBaseDefInput) === -1);
    }
    if (debug || notExistsOutputs.length > 0 || notExistsInputs.length > 0) {
      if (debug) {
        console.group('NgxBindIO: debug');
      } else {
        console.group('NgxBindIO: warning');
      }
      console.log('Host component:', directive.hostComponent.__proto__.constructor.name, directive.hostComponent);
      console.log('Inner component:', directive.innerComponent.__proto__.constructor.name, directive.innerComponent);
      if (directive.usedOutputs) {
        console.log(
          'Outputs maping:',
          Object.keys(directive.usedOutputs).map(hostKey => `(${directive.usedOutputs[hostKey]})="${hostKey}($event)"`)
        );
      }
      if (notExistsOutputs.length > 0) {
        console.log('Not initialized outputs:', notExistsOutputs);
        console.log('Not initialized outputs (text):', JSON.stringify(notExistsOutputs));
      }
      if (directive.usedInputs) {
        console.log(
          'Inputs maping:',
          Object.keys(directive.usedInputs).map(hostKey =>
            this._ngxBindInputsService.checkKeyNameToObservableInputBind(
              directive,
              hostKey,
              directive.usedInputs[hostKey]
            )
              ? `[${directive.usedInputs[hostKey]}]="${hostKey} | async"`
              : `[${directive.usedInputs[hostKey]}]="${hostKey}"`
          )
        );
      }
      if (notExistsInputs.length > 0) {
        console.log('Not initialized inputs:', notExistsInputs);
        console.log('Not initialized inputs (text):', JSON.stringify(notExistsInputs));
      }
      console.groupEnd();
    }
  }
}
