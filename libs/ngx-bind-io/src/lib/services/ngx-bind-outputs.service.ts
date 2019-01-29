import { EventEmitter, Injectable } from '@angular/core';
import { INgxBindIODirective } from '../interfaces/ngx-bind-io-directive.interface';
import { collectKeys, removeKeysManualBindedOutputs, removeKeysUsedInAttributes } from '../utils/components-utils';
import { getPropDescriptor } from '../utils/property-utils';
import { isFunction } from '../utils/utils';
import { getBindIOMetadata } from '../utils/bind-io-metadata-utils';

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
    const value = getPropDescriptor(directive.innerComponent, innerKey).value || directive.innerComponent[innerKey];
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
    const foundedOutputs = {
      hostKeys: [
        ...Object.keys(directive.hostComponent).filter(hostKey => isFunction(directive.hostComponent[hostKey])),
        ...collectKeys(
          directive.hostComponent.__proto__,
          (cmp, hostKey) => isFunction(getPropDescriptor(cmp, hostKey).value),
          10
        )
      ],
      innerKeys: directive.innerComponent
        ? [
            ...Object.keys(directive.innerComponent).filter(
              innerKey =>
                getPropDescriptor(directive.innerComponent, innerKey).value instanceof EventEmitter ||
                directive.innerComponent[innerKey] instanceof EventEmitter
            ),
            ...collectKeys(
              directive.innerComponent.__proto__,
              (cmp, innerKey) => getPropDescriptor(cmp, innerKey).value instanceof EventEmitter,
              10
            )
          ]
        : []
    };
    foundedOutputs.innerKeys = removeKeysManualBindedOutputs(
      directive,
      removeKeysUsedInAttributes(directive, foundedOutputs.innerKeys)
    );
    foundedOutputs.hostKeys = removeKeysUsedInAttributes(directive, foundedOutputs.hostKeys);
    return foundedOutputs;
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
