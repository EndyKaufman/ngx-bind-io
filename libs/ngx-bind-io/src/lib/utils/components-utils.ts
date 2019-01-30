import { INgxBindIODirective } from '../interfaces/ngx-bind-io-directive.interface';
import { getBindIOMetadata } from './bind-io-metadata-utils';

export function collectKeys(component: any, rule: (component: any, propName: string) => boolean, maxLevel?: number) {
  if (maxLevel !== undefined) {
    maxLevel--;
    if (maxLevel === 0) {
      return [];
    }
  }
  let keys = component ? Object.keys(component).filter(propName => rule(component, propName)) : [];
  if (component && component.__proto__) {
    keys = [...keys, ...collectKeys(component.__proto__, rule, maxLevel)];
  }
  return keys;
}
export function removeKeysUsedInAttributes(directive: Partial<INgxBindIODirective>, existsKeys: string[]) {
  const viewContainerRef = directive.viewContainerRef;
  if (
    viewContainerRef &&
    viewContainerRef.element &&
    viewContainerRef.element.nativeElement &&
    viewContainerRef.element.nativeElement.attributes
  ) {
    const attributes = viewContainerRef.element.nativeElement.attributes as NamedNodeMap;
    return existsKeys.filter(existKey => {
      let founded = false;
      for (let i = 0; i < attributes.length; i++) {
        const name = attributes
          .item(i)
          .name.replace(new RegExp('-', 'g'), '')
          .toUpperCase();
        if (existKey.replace(new RegExp('-', 'g'), '').toUpperCase() === name) {
          founded = true;
        }
      }
      return !founded;
    });
  }
  return existsKeys;
}
export function removeKeysManualBindedOutputs(directive: Partial<INgxBindIODirective>, existsKeys: string[]) {
  return existsKeys.filter(innerKey => {
    return (
      (getBindIOMetadata(directive.innerComponent).asInner.manualOutputs
        ? Object.keys(getBindIOMetadata(directive.innerComponent).asInner.manualOutputs)
        : []
      ).filter(outputName => outputName.toUpperCase() === innerKey.toUpperCase()).length === 0
    );
  });
}
export function removeKeysManualBindedInputs(directive: Partial<INgxBindIODirective>, existsKeys: string[]) {
  return existsKeys.filter(innerKey => {
    return (
      (getBindIOMetadata(directive.innerComponent).asInner.manualInputs
        ? Object.keys(getBindIOMetadata(directive.innerComponent).asInner.manualInputs)
        : []
      ).filter(inputName => inputName.toUpperCase() === innerKey.toUpperCase()).length === 0
    );
  });
}
