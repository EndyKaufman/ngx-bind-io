import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, isObservable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { INgxBindIODirective } from '../interfaces/ngx-bind-io-directive.interface';
import { getPropDescriptor, redefineAccessorProperty, redefineSimpleProperty } from '../utils/property-utils';

@Injectable()
export class NgxBindInputsService {
  /**
   * BindInputs Directive
   */
  bindInputs(directive: Partial<INgxBindIODirective>) {
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
  bindObservableInputs(directive: Partial<INgxBindIODirective>) {
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
  checkKeyNameToInputBind(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    return parentKey === key;
  }
  checkInputToBind(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    const parentValue = getPropDescriptor(directive.parentComponent, parentKey).value;
    return (
      directive.usedInputs[parentKey] === undefined &&
      !isObservable(parentValue) &&
      this.checkKeyNameToInputBind(directive, parentKey, key)
    );
  }
  bindInput(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    directive.usedInputs[parentKey] = key;

    const descriptor = getPropDescriptor(directive.parentComponent, parentKey);

    const currentValue: any = descriptor.value;
    delete directive.parentComponent[parentKey];
    if (descriptor !== undefined && descriptor.setter !== undefined && descriptor.getter !== undefined) {
      redefineAccessorProperty(directive.parentComponent, parentKey, descriptor.originalDescriptor, (newValue: any) =>
        directive.bindValue(key, newValue)
      );
    } else {
      redefineSimpleProperty(directive.parentComponent, parentKey, (newValue: any) =>
        directive.bindValue(key, newValue)
      );
    }
    directive.parentComponent[parentKey] = currentValue;
  }
  /**
   * Observable Inputs
   */
  checkKeyNameToObservableInputBind(directive: Partial<INgxBindIODirective>, parentKey, key) {
    return parentKey === `${key}$`;
  }
  checkObservableInputToBind(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    const parentValue = getPropDescriptor(directive.parentComponent, parentKey).value;
    return (
      directive.usedInputs[parentKey] === undefined &&
      isObservable(parentValue) &&
      this.checkKeyNameToObservableInputBind(directive, parentKey, key)
    );
  }
  bindObservableInput(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    directive.usedInputs[parentKey] = key;

    const descriptor = getPropDescriptor(directive.parentComponent, parentKey);
    const isBehaviorSubject = descriptor.value instanceof BehaviorSubject;
    const currentValue = descriptor.value;
    const behaviorSubjectValue = isBehaviorSubject ? descriptor.value.getValue() : undefined;

    delete directive.parentComponent[parentKey];

    if (descriptor !== undefined && descriptor.setter !== undefined && descriptor.getter !== undefined) {
      redefineAccessorProperty(directive.parentComponent, parentKey, descriptor.originalDescriptor, (newValue: any) => {
        if (directive.parentComponent[parentKey + '_subscription']) {
          (directive.parentComponent[parentKey + '_subscription'] as Subscription).unsubscribe();
        }
        directive.parentComponent[parentKey + '_subscription'] = newValue
          .pipe(takeUntil(directive.destroyed$))
          .subscribe(value => directive.bindValue(key, value));
      });
    } else {
      redefineSimpleProperty(directive.parentComponent, parentKey, (newValue: any) => {
        if (directive.parentComponent[parentKey + '_subscription']) {
          (directive.parentComponent[parentKey + '_subscription'] as Subscription).unsubscribe();
        }
        directive.parentComponent[parentKey + '_subscription'] = newValue
          .pipe(takeUntil(directive.destroyed$))
          .subscribe(value => directive.bindValue(key, value));
      });
    }
    directive.parentComponent[parentKey] = currentValue;
    if (isBehaviorSubject) {
      currentValue.next(behaviorSubjectValue);
    }
  }
  /**
   * Utils
   */
  getInputs(directive: Partial<INgxBindIODirective>) {
    const foundedInputs = {
      parentKeys: [
        ...Object.keys(directive.parentComponent),
        ...Object.keys(directive.parentComponent.__proto__),
        ...Object.keys(directive.parentComponent.__proto__ ? directive.parentComponent.__proto__.__proto__ : [])
      ],
      keys: [
        ...Object.keys(directive.component ? directive.component : []).filter(
          key => !(getPropDescriptor(directive.component, key).value instanceof EventEmitter)
        )
      ]
    };
    return foundedInputs;
  }
}
