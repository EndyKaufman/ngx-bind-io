import { EventEmitter, Injectable } from '@angular/core';
import { IBindIO } from '../interfaces/bind-io.interface';
import { isFunction } from '../utils/utils';

@Injectable()
export class NgxBindOutputsService {
  /**
   * BindOutputs Directive
   */
  bindOutputs(directive: Partial<IBindIO>) {
    const excludeOutputs = (Array.isArray(directive.excludeOutputs)
      ? directive.excludeOutputs
      : [directive.excludeOutputs]
    ).map(key => key.toUpperCase());
    const includeOutputs = (Array.isArray(directive.includeOutputs)
      ? directive.includeOutputs
      : [directive.includeOutputs]
    ).map(key => key.toUpperCase());
    directive.outputs.parentKeys
      .filter(
        parentKey =>
          (includeOutputs.length === 0 && excludeOutputs.indexOf(parentKey.toUpperCase()) === -1) ||
          (includeOutputs.length !== 0 && includeOutputs.indexOf(parentKey.toUpperCase()) !== -1)
      )
      .forEach(parentKey => {
        directive.outputs.keys.forEach(key => {
          if (this.checkOutputToBind(directive, parentKey, key)) {
            this.bindOutput(directive, parentKey, key);
          }
        });
      });
  }
  /**
   * Outputs
   */
  checkKeyNameToOutputBind(directive: Partial<IBindIO>, parentKey: string, key: string) {
    const keyWithFirstUpperLetter = key.length > 0 ? key.charAt(0).toUpperCase() + key.substr(1) : key;
    return (
      (parentKey === `on${keyWithFirstUpperLetter}` &&
        directive.outputs.parentKeys.indexOf(`on${keyWithFirstUpperLetter}Click`) === -1) ||
      parentKey === `on${keyWithFirstUpperLetter}Click`
    );
  }
  checkOutputToBind(directive: Partial<IBindIO>, parentKey: string, key: string) {
    return directive.used.indexOf(key) === -1 && this.checkKeyNameToOutputBind(directive, parentKey, key);
  }
  bindOutput(directive: Partial<IBindIO>, parentKey: string, key: string) {
    directive.used.push(key);
    directive.component[key].subscribe(value => directive.parentComponent[parentKey](value));
  }
  /**
   * Utils
   */
  getOutputs(directive: Partial<IBindIO>) {
    const data = {
      parentKeys: [
        ...Object.keys(directive.parentComponent).filter(parentKey => isFunction(directive.parentComponent[parentKey])),
        ...Object.keys(directive.parentComponent.__proto__).filter(parentKey =>
          isFunction(directive.parentComponent.__proto__[parentKey])
        ),
        ...Object.keys(directive.parentComponent.__proto__ ? directive.parentComponent.__proto__.__proto__ : []).filter(
          parentKey => isFunction(directive.parentComponent.__proto__.__proto__[parentKey])
        )
      ],
      keys: [
        ...Object.keys(directive.component ? directive.component : []).filter(
          key => directive.component[key] instanceof EventEmitter
        )
      ]
    };
    return data;
  }
}
