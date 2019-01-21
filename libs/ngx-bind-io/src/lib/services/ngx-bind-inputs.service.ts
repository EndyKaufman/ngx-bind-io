import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, isObservable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBindIO } from '../interfaces/bind-io.interface';
import { getPropDescriptor, redefineAccessorProperty, redefineSimpleProperty } from '../utils/property-utils';

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
    const parentValue = getPropDescriptor(directive.parentComponent, parentKey).value;
    const value = getPropDescriptor(directive.component, key).value;
    return (
      directive.usedInputs.indexOf(parentKey) === -1 &&
      this.checkKeyNameToInputBind(directive, parentKey, key) &&
      !isObservable(parentValue) &&
      !isObservable(value)
    );
  }
  bindInput(directive: Partial<IBindIO>, parentKey: string, key: string) {
    directive.usedInputs.push(parentKey);

    const descriptor = getPropDescriptor(directive.parentComponent, parentKey);

    const currentValue: any = descriptor.value;
    delete directive.parentComponent[parentKey];
    if (descriptor !== undefined && descriptor.setter !== undefined && descriptor.getter !== undefined) {
      redefineAccessorProperty(
        directive.parentComponent,
        parentKey,
        descriptor.originalDescriptor,
        (newValue: any) =>
          directive.bindValue(key, newValue)
      );
    } else {
      redefineSimpleProperty(
        directive.parentComponent,
        parentKey,
        (newValue: any) =>
          directive.bindValue(key, newValue)
      );
    }
    directive.parentComponent[parentKey] = currentValue;
  }
  /**
   * Observable Inputs
   */
  checkKeyNameToObservableInputBind(directive: Partial<IBindIO>, parentKey, key) {
    return parentKey === `${key}$`;
  }
  checkObservableInputToBind(directive: Partial<IBindIO>, parentKey: string, key: string) {
    const parentValue = getPropDescriptor(directive.parentComponent, parentKey).value;
    const value = getPropDescriptor(directive.component, key).value;
    return (
      directive.usedInputs.indexOf(parentKey) === -1 &&
      this.checkKeyNameToObservableInputBind(directive, parentKey, key) &&
      isObservable(parentValue) &&
      !isObservable(value)
    );
  }
  bindObservableInput(directive: Partial<IBindIO>, parentKey: string, key: string) {
    directive.usedInputs.push(parentKey);

    const descriptor = getPropDescriptor(directive.parentComponent, parentKey);
    const isBehaviorSubject = descriptor.value instanceof BehaviorSubject;
    const currentValue = descriptor.value;
    const behaviorSubjectValue = isBehaviorSubject ? descriptor.value.getValue() : undefined;

    delete directive.parentComponent[parentKey];

    if (descriptor !== undefined && descriptor.setter !== undefined && descriptor.getter !== undefined) {
      redefineAccessorProperty(
        directive.parentComponent,
        parentKey,
        descriptor.originalDescriptor,
        (newValue: any) => {
          if (directive.parentComponent[parentKey + '_subscription']) {
            (directive.parentComponent[parentKey + '_subscription'] as Subscription).unsubscribe();
          }
          directive.parentComponent[parentKey + '_subscription'] =
            newValue
              .pipe(takeUntil(directive.destroyed$))
              .subscribe(value => directive.bindValue(key, value));
        });
    } else {
      redefineSimpleProperty(
        directive.parentComponent,
        parentKey,
        (newValue: any) => {
          if (directive.parentComponent[parentKey + '_subscription']) {
            (directive.parentComponent[parentKey + '_subscription'] as Subscription).unsubscribe();
          }
          directive.parentComponent[parentKey + '_subscription'] =
            newValue
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
  getInputs(directive: Partial<IBindIO>) {
    const data = {
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
    return data;
  }
}
