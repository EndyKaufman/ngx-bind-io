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
    outputs.parentKeys
      .filter(
        parentKey =>
          (includeOutputs.length === 0 && excludeOutputs.indexOf(parentKey.toUpperCase()) === -1) ||
          (includeOutputs.length !== 0 && includeOutputs.indexOf(parentKey.toUpperCase()) !== -1)
      )
      .forEach(parentKey => {
        outputs.keys
          .filter(
            key =>
              (includeOutputs.length === 0 && excludeOutputs.indexOf(key.toUpperCase()) === -1) ||
              (includeOutputs.length !== 0 && includeOutputs.indexOf(key.toUpperCase()) !== -1)
          )
          .forEach(key => {
            if (this.checkOutputToBind(directive, parentKey, key)) {
              this.bindOutput(directive, parentKey, key);
            }
          });
      });
  }
  /**
   * Outputs
   */
  checkKeyNameToOutputBind(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    const outputs = directive.outputs;
    const keyWithFirstUpperLetter = key.length > 0 ? key.charAt(0).toUpperCase() + key.substr(1) : key;
    return (
      (parentKey === `on${keyWithFirstUpperLetter}` &&
        outputs.parentKeys.indexOf(`on${keyWithFirstUpperLetter}Click`) === -1) ||
      parentKey === `on${keyWithFirstUpperLetter}Click`
    );
  }
  checkOutputToBind(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    const value = getPropDescriptor(directive.component, key).value || directive.component[key];
    return (
      directive.usedOutputs[parentKey] === undefined &&
      value instanceof EventEmitter &&
      this.checkKeyNameToOutputBind(directive, parentKey, key)
    );
  }
  bindOutput(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    directive.usedOutputs[parentKey] = key;
    directive.component[key].subscribe(value => directive.parentComponent[parentKey](value));
  }
  /**
   * Utils
   */
  getOutputs(directive: Partial<INgxBindIODirective>) {
    const foundedOutputs = {
      parentKeys: [
        ...Object.keys(directive.parentComponent).filter(parentKey => isFunction(directive.parentComponent[parentKey])),
        ...collectKeys(
          directive.parentComponent.__proto__,
          (cmp, key) => isFunction(getPropDescriptor(cmp, key).value),
          10
        )
      ],
      keys: directive.component
        ? [
            ...Object.keys(directive.component).filter(
              key =>
                getPropDescriptor(directive.component, key).value instanceof EventEmitter ||
                directive.component[key] instanceof EventEmitter
            ),
            ...collectKeys(
              directive.component.__proto__,
              (cmp, key) => getPropDescriptor(cmp, key).value instanceof EventEmitter,
              10
            )
          ]
        : []
    };
    foundedOutputs.keys = removeKeysManualBindedOutputs(
      directive,
      removeKeysUsedInAttributes(directive, foundedOutputs.keys)
    );
    foundedOutputs.parentKeys = removeKeysUsedInAttributes(directive, foundedOutputs.parentKeys);
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
    const excludeOutputs = [...exclude, ...excludeIO].map(key => key.toUpperCase());
    const includeOutputs = [...include, ...includeIO].map(key => key.toUpperCase());
    return { includeOutputs, excludeOutputs };
  }
}
