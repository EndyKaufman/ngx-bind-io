import { ViewContainerRef } from '@angular/core';
import { IBindIOMetadata } from '../interfaces/__bind-io-metadata__.interface';

export function isFunction(functionToCheck: any) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
  return derivedCtor;
}
export function Mixin(baseCtors: Function[]) {
  return function(derivedCtor: Function) {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
    });
  };
}
export function collectKeys(component: any, rule: (component: any, key: string) => boolean, maxLevel?: number) {
  if (maxLevel !== undefined) {
    maxLevel--;
    if (maxLevel === 0) {
      return [];
    }
  }
  let keys = component ? Object.keys(component).filter(key => rule(component, key)) : [];
  if (component && component.__proto__) {
    keys = [...keys, ...collectKeys(component.__proto__, rule, maxLevel)];
  }
  return keys;
}
export function removeKeysUsedInAttributes(directive: any, existsKeys: string[]) {
  const viewContainerRef = (directive as any)._viewContainerRef as ViewContainerRef;
  if (
    viewContainerRef &&
    viewContainerRef.element &&
    viewContainerRef.element.nativeElement &&
    viewContainerRef.element.nativeElement.attributes
  ) {
    const attributes = viewContainerRef.element.nativeElement.attributes as NamedNodeMap;
    return existsKeys.filter(key => {
      let founded = false;
      for (let i = 0; i < attributes.length; i++) {
        const name = attributes
          .item(i)
          .name.replace(new RegExp('-', 'g'), '')
          .replace('ngreflect', '')
          .toUpperCase();
        if (key.replace(new RegExp('-', 'g'), '').toUpperCase() === name) {
          founded = true;
        }
      }
      return !founded;
    });
  }
  return existsKeys;
}
export function getBindIOMetadata(component: any) {
  if (!component['__bindIO__']) {
    (component['__bindIO__'] as IBindIOMetadata) = {
      asHost: {
        subjects: {}
      },
      asInner: {
        subscriptions: {}
      }
    };
  }
  return component['__bindIO__'] as IBindIOMetadata;
}
