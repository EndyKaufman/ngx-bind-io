import { Injectable } from '@angular/core';
import { INgxBindIODirective } from '../interfaces/ngx-bind-io-directive.interface';
import { removeKeysUsedInAttributes } from '../utils/utils';
import { NgxBindInputsService } from './ngx-bind-inputs.service';

@Injectable()
export class NgxBindIODebugService {
  constructor(private _ngxBindInputsService: NgxBindInputsService) {}
  showDebugInfo(directive: Partial<INgxBindIODirective>, debug: boolean) {
    let notExistsOutputs: string[] = [];
    let notExistsInputs: string[] = [];
    if (
      directive.outputs &&
      directive.component &&
      directive.component.__proto__ &&
      directive.component.__proto__.constructor &&
      directive.component.__proto__.constructor.ngBaseDef &&
      directive.component.__proto__.constructor.ngBaseDef.outputs
    ) {
      const ngBaseDefOutputs = Object.keys(directive.component.__proto__.constructor.ngBaseDef.outputs);
      notExistsOutputs = removeKeysUsedInAttributes(directive, ngBaseDefOutputs).filter(
        ngBaseDefOutput => directive.outputs.keys.indexOf(ngBaseDefOutput) === -1
      );
    }
    if (
      directive.inputs &&
      directive.component &&
      directive.component.__proto__ &&
      directive.component.__proto__.constructor &&
      directive.component.__proto__.constructor.ngBaseDef &&
      directive.component.__proto__.constructor.ngBaseDef.inputs
    ) {
      const ngBaseDefInputs = Object.keys(directive.component.__proto__.constructor.ngBaseDef.inputs);
      notExistsInputs = removeKeysUsedInAttributes(directive, ngBaseDefInputs).filter(
        ngBaseDefInput => directive.inputs.keys.indexOf(ngBaseDefInput) === -1
      );
    }
    if (debug || notExistsOutputs.length > 0 || notExistsInputs.length > 0) {
      if (debug) {
        console.group('NgxBindIO: debug');
      } else {
        console.group('NgxBindIO: warning');
      }
      console.log('Component:', directive.component.__proto__.constructor.name, directive.component);
      if (directive.usedOutputs) {
        console.log(
          'Outputs maping:',
          Object.keys(directive.usedOutputs).map(
            parentKey => `(${directive.usedOutputs[parentKey]})="${parentKey}($event)"`
          )
        );
      }
      if (notExistsOutputs.length > 0) {
        console.log('Not initialized outputs:', notExistsOutputs);
        console.log('Not initialized outputs (text):', JSON.stringify(notExistsOutputs));
      }
      if (directive.usedInputs) {
        console.log(
          'Inputs maping:',
          Object.keys(directive.usedInputs).map(parentKey =>
            this._ngxBindInputsService.checkKeyNameToObservableInputBind(
              directive,
              parentKey,
              directive.usedInputs[parentKey]
            )
              ? `[${directive.usedInputs[parentKey]}]="${parentKey} | async"`
              : `[${directive.usedInputs[parentKey]}]="${parentKey}"`
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
