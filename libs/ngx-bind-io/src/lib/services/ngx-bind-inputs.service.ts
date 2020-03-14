import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, isObservable, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { INgxBindIODirective } from '../interfaces/ngx-bind-io-directive.interface';
import { getBindIOMetadata } from '../utils/bind-io-metadata-utils';
import {
  collectKeys,
  removeKeysManualBindedInputs,
  removeKeysNotAllowedConstants,
  removeKeysUsedInAttributes
} from '../utils/components-utils';
import { getPropDescriptor, redefineAccessorProperty, redefineSimpleProperty } from '../utils/property-utils';
import { isFunction } from '../utils/utils';

@Injectable()
export class NgxBindInputsService {
  /**
   * BindInputs Directive
   */
  bindInputs(directive: Partial<INgxBindIODirective>) {
    const inputs = directive.inputs;
    const { includeInputs, excludeInputs } = this.getIncludesAndExcludes(directive);
    inputs.hostKeys
      .filter(
        hostKey =>
          (includeInputs.length === 0 && excludeInputs.indexOf(hostKey.toUpperCase()) === -1) ||
          (includeInputs.length !== 0 && includeInputs.indexOf(hostKey.toUpperCase()) !== -1)
      )
      .forEach(hostKey => {
        inputs.innerKeys
          .filter(
            innerKey =>
              (includeInputs.length === 0 && excludeInputs.indexOf(innerKey.toUpperCase()) === -1) ||
              (includeInputs.length !== 0 && includeInputs.indexOf(innerKey.toUpperCase()) !== -1)
          )
          .forEach(innerKey => {
            if (this.checkInputToBind(directive, hostKey, innerKey)) {
              this.bindInput(directive, hostKey, innerKey);
            }
          });
      });
  }
  bindObservableInputs(directive: Partial<INgxBindIODirective>) {
    const inputs = directive.inputs;
    const { includeInputs, excludeInputs } = this.getIncludesAndExcludes(directive);
    inputs.hostKeys
      .filter(
        hostKey =>
          (includeInputs.length === 0 && excludeInputs.indexOf(hostKey.toUpperCase()) === -1) ||
          (includeInputs.length !== 0 && includeInputs.indexOf(hostKey.toUpperCase()) !== -1)
      )
      .forEach(hostKey => {
        inputs.innerKeys
          .filter(
            innerKey =>
              (includeInputs.length === 0 && excludeInputs.indexOf(innerKey.toUpperCase()) === -1) ||
              (includeInputs.length !== 0 && includeInputs.indexOf(innerKey.toUpperCase()) !== -1)
          )
          .forEach(innerKey => {
            if (this.checkObservableInputToBind(directive, hostKey, innerKey)) {
              this.bindObservableInput(directive, hostKey, innerKey);
            }
          });
      });
  }
  /**
   * Inputs
   */
  checkKeyNameToInputBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    return hostKey === innerKey && hostKey[0] !== '_';
  }
  checkInputToBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    const hostValue = getPropDescriptor(directive.hostComponent, hostKey).value;
    return (
      directive.usedInputs[hostKey] === undefined &&
      !isObservable(hostValue) &&
      this.checkKeyNameToInputBind(directive, hostKey, innerKey)
    );
  }
  bindInput(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    directive.usedInputs[hostKey] = innerKey;
    const descriptor = getPropDescriptor(directive.hostComponent, hostKey);
    const currentValue: any = descriptor.value;
    const currentHostSubject = getBindIOMetadata(directive.hostComponent).asHost.subjects[hostKey];
    if (!currentHostSubject) {
      getBindIOMetadata(directive.hostComponent).asHost.subjects[hostKey] = new Subject<any>();
      delete directive.hostComponent[hostKey];
      if (descriptor !== undefined && descriptor.setter !== undefined && descriptor.getter !== undefined) {
        redefineAccessorProperty(directive.hostComponent, hostKey, descriptor.originalDescriptor, (newValue: any) =>
          getBindIOMetadata(directive.hostComponent).asHost.subjects[hostKey].next(newValue)
        );
      } else {
        redefineSimpleProperty(directive.hostComponent, hostKey, (newValue: any) =>
          getBindIOMetadata(directive.hostComponent).asHost.subjects[hostKey].next(newValue)
        );
      }
    }
    getBindIOMetadata(directive.hostComponent)
      .asHost.subjects[hostKey].pipe(takeUntil(directive.destroyed$))
      .subscribe(value => directive.bindValue(innerKey, value));
    try {
      if (!currentHostSubject) {
        directive.hostComponent[hostKey] = currentValue;
      } else {
        if (!directive.ignoreKeysManualBinded) {
          directive.bindValue(innerKey, currentValue);
        }
      }
    } catch (error) {}
  }
  /**
   * Observable Inputs
   */
  checkKeyNameToObservableInputBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    return hostKey === `${innerKey}$` && hostKey[0] !== '_';
  }
  checkObservableInputToBind(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    const descriptor = getPropDescriptor(directive.hostComponent, hostKey);
    const hostValue = descriptor.value;
    return (
      directive.usedInputs[hostKey] === undefined &&
      isObservable(hostValue) &&
      this.checkKeyNameToObservableInputBind(directive, hostKey, innerKey)
    );
  }
  bindObservableInput(directive: Partial<INgxBindIODirective>, hostKey: string, innerKey: string) {
    directive.usedInputs[hostKey] = innerKey;

    const descriptor = getPropDescriptor(directive.hostComponent, hostKey);
    const isBehaviorSubject = descriptor.value instanceof BehaviorSubject;
    const currentValue = descriptor.value;
    let behaviorSubjectValue: any;
    if (descriptor.value instanceof BehaviorSubject) {
      behaviorSubjectValue = descriptor.value.getValue();
    }
    const currentHostSubject = getBindIOMetadata(directive.hostComponent).asHost.subjects[hostKey];
    if (!currentHostSubject) {
      getBindIOMetadata(directive.hostComponent).asHost.subjects[hostKey] = new Subject<any>();
      delete directive.hostComponent[hostKey];
      if (descriptor !== undefined && descriptor.setter !== undefined && descriptor.getter !== undefined) {
        redefineAccessorProperty(directive.hostComponent, hostKey, descriptor.originalDescriptor, (newValue: any) =>
          getBindIOMetadata(directive.hostComponent).asHost.subjects[hostKey].next(newValue)
        );
      } else {
        redefineSimpleProperty(directive.hostComponent, hostKey, (newValue: any) =>
          getBindIOMetadata(directive.hostComponent).asHost.subjects[hostKey].next(newValue)
        );
      }
    }
    getBindIOMetadata(directive.hostComponent)
      .asHost.subjects[hostKey].pipe(takeUntil(directive.destroyed$))
      .subscribe(newValue => {
        if (newValue instanceof Observable) {
          if (getBindIOMetadata(directive.innerComponent).asInner.subscriptions[hostKey]) {
            getBindIOMetadata(directive.innerComponent).asInner.subscriptions[hostKey].unsubscribe();
          }
          getBindIOMetadata(directive.innerComponent).asInner.subscriptions[hostKey] = newValue
            .pipe(takeUntil(directive.destroyed$))
            .subscribe(value => directive.bindValue(innerKey, value));
        }
      });
    try {
      directive.hostComponent[hostKey] = currentValue;
    } catch (error) {}

    if (isBehaviorSubject) {
      currentValue.next(behaviorSubjectValue);
    }
  }
  /**
   * Utils
   */
  getInputs(directive: Partial<INgxBindIODirective>) {
    const { hostPropDescriptorKeys, innerPropDescriptorKeys } = this.getInputsFromPropDescriptor(directive);
    const { hostIvyKeys, innerIvyKeys } = this.getInputsFromIvy(directive);
    let innerKeys = [...innerPropDescriptorKeys, ...innerIvyKeys];
    let hostKeys = [...hostPropDescriptorKeys, ...hostIvyKeys];
    hostKeys = [
      ...hostKeys,
      ...hostKeys
        .map(hostKey => hostKey + '$')
        .filter(
          hostKey =>
            hostKeys.indexOf(hostKey) === -1 &&
            (directive.hostComponent[hostKey] instanceof ReplaySubject ||
              directive.hostComponent[hostKey] instanceof Subject ||
              directive.hostComponent[hostKey] instanceof BehaviorSubject)
        )
    ];
    innerKeys = removeKeysManualBindedInputs(directive, removeKeysUsedInAttributes(directive, innerKeys));
    hostKeys = removeKeysUsedInAttributes(directive, hostKeys);
    const inputs = {
      hostKeys: removeKeysNotAllowedConstants(directive, hostKeys),
      innerKeys: removeKeysNotAllowedConstants(directive, innerKeys)
    };
    return inputs;
  }
  private getInputsFromPropDescriptor(directive: Partial<INgxBindIODirective>) {
    const innerPropDescriptorKeys = directive.innerComponent
      ? [
          ...Object.keys(directive.innerComponent).filter(
            innerKey => !(getPropDescriptor(directive.innerComponent, innerKey).value instanceof EventEmitter)
          ),
          ...collectKeys(
            directive.innerComponent.__proto__,
            (cmp, innerKey) => !(getPropDescriptor(cmp, innerKey).value instanceof EventEmitter),
            10
          )
        ]
      : [];
    const hostPropDescriptorKeys = collectKeys(
      directive.hostComponent,
      (cmp, hostKey) => !isFunction(getPropDescriptor(directive.hostComponent, hostKey).value),
      10
    );
    return { hostPropDescriptorKeys, innerPropDescriptorKeys };
  }

  private getInputsFromIvy(directive: Partial<INgxBindIODirective>) {
    const innerIvyKeys = directive.innerComponent
      ? [
          ...Object.keys(directive.innerComponent?.__proto__?.constructor?.ɵcmp?.inputs || {}).filter(
            key => !(getPropDescriptor(directive.innerComponent, key).value instanceof EventEmitter)
          )
        ]
      : [];
    const hostIvyKeys = directive.hostComponent
      ? [
          ...Object.keys(directive.hostComponent?.__proto__?.constructor?.ɵcmp?.inputs || {}).filter(
            key => !(getPropDescriptor(directive.hostComponent, key).value instanceof EventEmitter)
          )
        ]
      : [];
    return { hostIvyKeys, innerIvyKeys };
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
    const excludeInputs = [...exclude, ...excludeIO].map(excludeKey => excludeKey.toUpperCase());
    const includeInputs = [...include, ...includeIO].map(includeKey => includeKey.toUpperCase());
    return { includeInputs, excludeInputs };
  }
}
