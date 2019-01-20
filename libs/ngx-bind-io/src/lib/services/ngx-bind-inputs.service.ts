import { EventEmitter, Injectable } from '@angular/core';
import { isObservable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBindIO } from '../interfaces/bind-io.interface';

@Injectable()
export class NgxBindInputsService {
  /**
   * BindInputs Directive
   */
  bindInputs(directive: Partial<IBindIO>) {
    const inputs = this.getInputs(directive);
    const excludeInputs = (Array.isArray(directive.excludeInputs)
      ? directive.excludeInputs
      : [directive.excludeInputs]
    ).map(key => key.toUpperCase());
    const includeInputs = (Array.isArray(directive.includeInputs)
      ? directive.includeInputs
      : [directive.includeInputs]
    ).map(key => key.toUpperCase());
    inputs.parentKeys
      .filter(
        parentKey =>
          (includeInputs.length === 0 && excludeInputs.indexOf(parentKey.toUpperCase()) === -1) ||
          (includeInputs.length !== 0 && includeInputs.indexOf(parentKey.toUpperCase()) !== -1)
      )
      .forEach(parentKey => {
        inputs.keys.forEach(key => {
          if (this.checkInputToBind(directive, parentKey, key)) {
            this.bindInput(directive, parentKey, key);
          }
        });
      });
  }
  bindObservableInputs(directive: Partial<IBindIO>) {
    const inputs = this.getInputs(directive);
    const excludeInputs = (Array.isArray(directive.excludeInputs)
      ? directive.excludeInputs
      : [directive.excludeInputs]
    ).map(key => key.toUpperCase());
    const includeInputs = (Array.isArray(directive.includeInputs)
      ? directive.includeInputs
      : [directive.includeInputs]
    ).map(key => key.toUpperCase());

    inputs.parentKeys
      .filter(
        parentKey =>
          (includeInputs.length === 0 && excludeInputs.indexOf(parentKey.toUpperCase()) === -1) ||
          (includeInputs.length !== 0 && includeInputs.indexOf(parentKey.toUpperCase()) !== -1)
      )
      .forEach(parentKey => {
        inputs.keys.forEach(key => {
          if (this.checkObservableInputToBind(directive, parentKey, key)) {
            this.bindObservableInput(directive, parentKey, key);
          }
        });
      });
  }
  /**
   * Inputs
   */
  checkKeyNameToInputBind(directive: Partial<IBindIO>, parentKey: string, key: string) {
    return parentKey === key;
  }
  checkInputToBind(directive: Partial<IBindIO>, parentKey: string, key: string) {
    return (
      directive.usedInputs.indexOf(parentKey) === -1 &&
      this.checkKeyNameToInputBind(directive, parentKey, key) &&
      !isObservable(directive.parentComponent[parentKey]) &&
      !isObservable(directive.component[key])
    );
  }
  bindInput(directive: Partial<IBindIO>, parentKey: string, key: string) {
    directive.usedInputs.push(parentKey);
    directive.component[key] = directive.parentComponent[parentKey];
  }
  /**
   * Observable Inputs
   */
  checkKeyNameToObservableInputBind(directive: Partial<IBindIO>, parentKey, key) {
    return parentKey === `${key}$`;
  }
  checkObservableInputToBind(directive: Partial<IBindIO>, parentKey: string, key: string) {
    return (
      directive.usedInputs.indexOf(parentKey) === -1 &&
      this.checkKeyNameToObservableInputBind(directive, parentKey, key) &&
      isObservable(directive.parentComponent[parentKey]) &&
      !isObservable(directive.component[key])
    );
  }
  bindObservableInput(directive: Partial<IBindIO>, parentKey: string, key: string) {
    directive.usedInputs.push(parentKey);
    directive.parentComponent[parentKey]
      .pipe(takeUntil(directive.destroyed$))
      .subscribe(value => directive.bindValue(key, value));
  }
  /**
   * Utils
   */
  getInputs(directive: Partial<IBindIO>) {
    const data = {
      parentKeys: [
        ...Object.keys(directive.parentComponent),
        ...Object.keys(directive.parentComponent.__proto__),
        ...Object.keys(directive.parentComponent.__proto__ ? directive.parentComponent.__proto__.__proto__ : [])
      ],
      keys: [
        ...Object.keys(directive.component ? directive.component : []).filter(
          key => !(directive.component[key] instanceof EventEmitter)
        )
      ]
    };
    return data;
  }
}
