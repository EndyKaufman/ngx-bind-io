import { EventEmitter, Injectable } from '@angular/core';
import { INgxBindIODirective } from '../interfaces/ngx-bind-io-directive.interface';
import {
  collectKeys,
  removeKeysManualBindedOutputs,
  removeKeysNotAllowedConstants,
  removeKeysUsedInAttributes
} from '../utils/components-utils';
import { getPropDescriptor } from '../utils/property-utils';
import { isFunction } from '../utils/utils';

@Injectable()
export class NgxBindOutputsService {
  /**
   * BindOutputs Directive
   */
  bindOutputs(directive: Partial<INgxBindIODirective>) {
    const outputs = directive.outputs;
    const { includeOutputs, excludeOutputs } = this.getIncludesAndExcludes(directive);
    outputs.hostKeys
      .filter(
        hostKey =>
          (includeOutputs.length === 0 && excludeOutputs.indexOf(hostKey.toUpperCase()) === -1) ||
          (includeOutputs.length !== 0 && includeOutputs.indexOf(hostKey.toUpperCase()) !== -1)
      )
      .forEach(hostKey => {
        outputs.innerKeys
          .filter(
            innerKey =>
              (includeOutputs.length === 0 && excludeOutputs.indexOf(innerKey.toUpperCase()) === -1) ||
              (includeOutputs.length !== 0 && includeOutputs.indexOf(innerKey.toUpperCase()) !== -1)
          )
          .forEach(innerKey => {
            if (this.checkOutputToBind(directive, hostKey, innerKey)) {
              this.bindOutput(directive, hostKey, innerKey);
            }
          });
      });
  }
  /**
   * Outputs
   */
  checkKeyNameToOutputBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    const outputs = directive.outputs;
    const keyWithFirstUpperLetter =
      innerKey.length > 0 ? innerKey.charAt(0).toUpperCase() + innerKey.substr(1) : innerKey;
    return (
      (hostKey === `on${keyWithFirstUpperLetter}` &&
        outputs.hostKeys.indexOf(`on${keyWithFirstUpperLetter}Click`) === -1) ||
      hostKey === `on${keyWithFirstUpperLetter}Click`
    );
  }
  checkOutputToBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    const value = getPropDescriptor(directive.innerComponent, innerKey).value;
    return (
      directive.usedOutputs[hostKey] === undefined &&
      value instanceof EventEmitter &&
      this.checkKeyNameToOutputBind(directive, hostKey, innerKey)
    );
  }
  bindOutput(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    directive.usedOutputs[hostKey] = innerKey;
    directive.innerComponent[innerKey].subscribe(value => directive.hostComponent[hostKey](value));
  }
  /**
   * Utils
   */
  getOutputs(directive: Partial<INgxBindIODirective>) {
    const { innerPropDescriptorKeys, hostPropDescriptorKeys } = this.getOutputsFromPropDescriptor(directive);
    const { hostIvyKeys, innerIvyKeys } = this.getIvyOutputs(directive);
    let innerKeys = [...innerPropDescriptorKeys, ...innerIvyKeys];
    let hostKeys = [...hostPropDescriptorKeys, ...hostIvyKeys];
    innerKeys = removeKeysManualBindedOutputs(directive, removeKeysUsedInAttributes(directive, innerKeys));
    hostKeys = removeKeysUsedInAttributes(directive, hostKeys);
    const outputs = {
      hostKeys: removeKeysNotAllowedConstants(directive, hostKeys),
      innerKeys: removeKeysNotAllowedConstants(directive, innerKeys)
    };
    if (directive.innerComponent.name === 'BasicBindIOComponent') {
      console.log(directive.innerComponent.name, { directive, outputs });
    }
    return outputs;
  }

  private getOutputsFromPropDescriptor(directive: Partial<INgxBindIODirective>) {
    const hostPropDescriptorKeys = [
      ...Object.keys(directive.hostComponent).filter(hostKey => isFunction(directive.hostComponent[hostKey])),
      ...collectKeys(
        directive.hostComponent.__proto__,
        (cmp, hostKey) => isFunction(getPropDescriptor(cmp, hostKey).value),
        10
      )
    ];
    const innerPropDescriptorKeys = directive.innerComponent
      ? [
          ...Object.keys(directive.innerComponent).filter(
            innerKey => getPropDescriptor(directive.innerComponent, innerKey).value instanceof EventEmitter
          ),
          ...collectKeys(
            directive.innerComponent.__proto__,
            (cmp, innerKey) => getPropDescriptor(cmp, innerKey).value instanceof EventEmitter,
            10
          )
        ]
      : [];
    return { innerPropDescriptorKeys, hostPropDescriptorKeys };
  }

  private getIvyOutputs(directive: Partial<INgxBindIODirective>) {
    const hostIvyKeys = directive.hostComponent
      ? [
          ...Object.keys(directive.hostComponent?.__proto__?.constructor?.ɵcmp?.outputs || {}).filter(
            key => getPropDescriptor(directive.hostComponent, key).value instanceof EventEmitter
          )
        ]
      : [];
    const innerIvyKeys = [
      ...Object.keys(directive.innerComponent?.__proto__?.constructor?.ɵcmp?.outputs || {}).filter(
        key => getPropDescriptor(directive.innerComponent, key).value instanceof EventEmitter
      )
    ];
    return { innerIvyKeys, hostIvyKeys };
  }

  getIncludesAndExcludes(directive: Partial<INgxBindIODirective>) {
    const exclude = Array.isArray(directive.excludeOutputs) ? directive.excludeOutputs : [directive.excludeOutputs];
    const include = Array.isArray(directive.includeOutputs) ? directive.includeOutputs : [directive.includeOutputs];
    const includeIO = !directive.includeIO
      ? []
      : Array.isArray(directive.includeIO)
      ? directive.includeIO
      : [directive.includeIO];
    const excludeIO = !directive.excludeIO
      ? []
      : Array.isArray(directive.excludeIO)
      ? directive.excludeIO
      : [directive.excludeIO];
    const excludeOutputs = [...exclude, ...excludeIO].map(exludeKey => exludeKey.toUpperCase());
    const includeOutputs = [...include, ...includeIO].map(includeKey => includeKey.toUpperCase());
    return { includeOutputs, excludeOutputs };
  }
}
