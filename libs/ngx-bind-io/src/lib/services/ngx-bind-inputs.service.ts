import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, isObservable, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { INgxBindIODirective } from '../interfaces/ngx-bind-io-directive.interface';
import { getPropDescriptor, redefineAccessorProperty, redefineSimpleProperty } from '../utils/property-utils';
import { collectKeys, getBindIOMetadata, isFunction, removeKeysUsedInAttributes } from '../utils/utils';

@Injectable()
export class NgxBindInputsService {
  /**
   * BindInputs Directive
   */
  bindInputs(directive: Partial<INgxBindIODirective>) {
    const inputs = directive.inputs;
    const { includeInputs, excludeInputs } = this.getIncludesAndExcludes(directive);
    inputs.parentKeys
      .filter(
        parentKey =>
          (includeInputs.length === 0 && excludeInputs.indexOf(parentKey.toUpperCase()) === -1) ||
          (includeInputs.length !== 0 && includeInputs.indexOf(parentKey.toUpperCase()) !== -1)
      )
      .forEach(parentKey => {
        inputs.keys
          .filter(
            key =>
              (includeInputs.length === 0 && excludeInputs.indexOf(key.toUpperCase()) === -1) ||
              (includeInputs.length !== 0 && includeInputs.indexOf(key.toUpperCase()) !== -1)
          )
          .forEach(key => {
            if (this.checkInputToBind(directive, parentKey, key)) {
              this.bindInput(directive, parentKey, key);
            }
          });
      });
  }
  bindObservableInputs(directive: Partial<INgxBindIODirective>) {
    const inputs = directive.inputs;
    const { includeInputs, excludeInputs } = this.getIncludesAndExcludes(directive);
    inputs.parentKeys
      .filter(
        parentKey =>
          (includeInputs.length === 0 && excludeInputs.indexOf(parentKey.toUpperCase()) === -1) ||
          (includeInputs.length !== 0 && includeInputs.indexOf(parentKey.toUpperCase()) !== -1)
      )
      .forEach(parentKey => {
        inputs.keys
          .filter(
            key =>
              (includeInputs.length === 0 && excludeInputs.indexOf(key.toUpperCase()) === -1) ||
              (includeInputs.length !== 0 && includeInputs.indexOf(key.toUpperCase()) !== -1)
          )
          .forEach(key => {
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
    return parentKey === key && parentKey[0] !== '_';
  }
  checkInputToBind(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    const parentValue =
      getPropDescriptor(directive.parentComponent, parentKey).value || directive.parentComponent[parentKey];
    return (
      directive.usedInputs[parentKey] === undefined &&
      !isObservable(parentValue) &&
      this.checkKeyNameToInputBind(directive, parentKey, key)
    );
  }
  bindInput(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    directive.usedInputs[parentKey] = key;
    const descriptor = getPropDescriptor(directive.parentComponent, parentKey);
    const currentValue: any = descriptor.value || directive.parentComponent[parentKey];
    if (!getBindIOMetadata(directive.parentComponent).asHost[parentKey]) {
      getBindIOMetadata(directive.parentComponent).asHost[parentKey] = new Subject<any>();
      delete directive.parentComponent[parentKey];
      if (descriptor !== undefined && descriptor.setter !== undefined && descriptor.getter !== undefined) {
        redefineAccessorProperty(directive.parentComponent, parentKey, descriptor.originalDescriptor, (newValue: any) =>
          getBindIOMetadata(directive.parentComponent).asHost[parentKey].next(newValue)
        );
      } else {
        redefineSimpleProperty(directive.parentComponent, parentKey, (newValue: any) =>
          getBindIOMetadata(directive.parentComponent).asHost[parentKey].next(newValue)
        );
      }
    }
    getBindIOMetadata(directive.parentComponent)
      .asHost[parentKey].pipe(takeUntil(directive.destroyed$))
      .subscribe(value => directive.bindValue(key, value));
    directive.parentComponent[parentKey] = currentValue;
  }
  /**
   * Observable Inputs
   */
  checkKeyNameToObservableInputBind(directive: Partial<INgxBindIODirective>, parentKey, key) {
    return parentKey === `${key}$` && parentKey[0] !== '_';
  }
  checkObservableInputToBind(directive: Partial<INgxBindIODirective>, parentKey: string, key: string) {
    const parentValue =
      getPropDescriptor(directive.parentComponent, parentKey).value || directive.parentComponent[parentKey];
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
    const currentValue = descriptor.value || directive.parentComponent[parentKey];
    let behaviorSubjectValue: any;
    if (descriptor.value instanceof BehaviorSubject) {
      behaviorSubjectValue = descriptor.value.getValue();
    }
    if (!getBindIOMetadata(directive.parentComponent).asHost[parentKey]) {
      getBindIOMetadata(directive.parentComponent).asHost[parentKey] = new Subject<any>();
      delete directive.parentComponent[parentKey];
      if (descriptor !== undefined && descriptor.setter !== undefined && descriptor.getter !== undefined) {
        redefineAccessorProperty(directive.parentComponent, parentKey, descriptor.originalDescriptor, (newValue: any) =>
          getBindIOMetadata(directive.parentComponent).asHost[parentKey].next(newValue)
        );
      } else {
        redefineSimpleProperty(directive.parentComponent, parentKey, (newValue: any) =>
          getBindIOMetadata(directive.parentComponent).asHost[parentKey].next(newValue)
        );
      }
    }
    getBindIOMetadata(directive.parentComponent)
      .asHost[parentKey].pipe(takeUntil(directive.destroyed$))
      .subscribe(newValue => {
        if (newValue instanceof Observable) {
          if (getBindIOMetadata(directive.component).asInner[parentKey]) {
            getBindIOMetadata(directive.component).asInner[parentKey].unsubscribe();
          }
          getBindIOMetadata(directive.component).asInner[parentKey] = newValue
            .pipe(takeUntil(directive.destroyed$))
            .subscribe(value => directive.bindValue(key, value));
        }
      });
    try {
      directive.parentComponent[parentKey] = currentValue;
    } catch (error) {}
    if (isBehaviorSubject) {
      currentValue.next(behaviorSubjectValue);
    }
  }
  /**
   * Utils
   */
  getInputs(directive: Partial<INgxBindIODirective>) {
    const foundedInputs = {
      parentKeys: collectKeys(
        directive.parentComponent,
        (cmp, key) =>
          !isFunction(getPropDescriptor(directive.component, key).value) || !isFunction(directive.component[key]),
        10
      ),
      keys: directive.component
        ? [
            ...Object.keys(directive.component).filter(
              key =>
                !(
                  getPropDescriptor(directive.component, key).value instanceof EventEmitter ||
                  directive.component[key] instanceof EventEmitter
                )
            ),
            ...collectKeys(
              directive.component.__proto__,
              (cmp, key) => !(getPropDescriptor(cmp, key).value instanceof EventEmitter),
              10
            )
          ]
        : []
    };
    foundedInputs.parentKeys = [
      ...foundedInputs.parentKeys,
      ...foundedInputs.parentKeys
        .map(parentKey => parentKey + '$')
        .filter(
          parentKey =>
            foundedInputs.parentKeys.indexOf(parentKey) === -1 &&
            (directive.parentComponent[parentKey] instanceof ReplaySubject ||
              directive.parentComponent[parentKey] instanceof Subject ||
              directive.parentComponent[parentKey] instanceof BehaviorSubject)
        )
    ];
    foundedInputs.keys = removeKeysUsedInAttributes(directive, foundedInputs.keys);
    foundedInputs.parentKeys = removeKeysUsedInAttributes(directive, foundedInputs.parentKeys);
    return foundedInputs;
  }
  getIncludesAndExcludes(directive: Partial<INgxBindIODirective>) {
    const exclude = Array.isArray(directive.excludeInputs) ? directive.excludeInputs : [directive.excludeInputs];
    const include = Array.isArray(directive.includeInputs) ? directive.includeInputs : [directive.includeInputs];
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
    const excludeInputs = [...exclude, ...excludeIO].map(key => key.toUpperCase());
    const includeInputs = [...include, ...includeIO].map(key => key.toUpperCase());
    return { includeInputs, excludeInputs };
  }
}
