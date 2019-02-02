import { OnChanges, SimpleChanges } from '@angular/core';
import { getBindIOMetadata } from '../utils/bind-io-metadata-utils';

export class BindIoInnerLifecycle implements OnChanges {
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (!getBindIOMetadata(this).asInner.manualInputs) {
      getBindIOMetadata(this).asInner.manualInputs = {};
      if (simpleChanges) {
        Object.keys(simpleChanges).forEach(innerKey => (getBindIOMetadata(this).asInner.manualInputs[innerKey] = 1));
      }
    }
    if (typeof (this as any).__proto__.__originalNgOnChanges__ === 'function') {
      (this as any).__proto__.__originalNgOnChanges__(simpleChanges);
    }
  }
}
export function BindIoInner() {
  return function (target: Function) {
    if (!target.prototype.__originalNgOnChanges__) {
      const bindIoInnerLifecycle = new BindIoInnerLifecycle();
      target.prototype.__originalNgOnChanges__ = target.prototype.ngOnChanges;
      target.prototype.ngOnChanges = bindIoInnerLifecycle.ngOnChanges;
    }
  };
}
