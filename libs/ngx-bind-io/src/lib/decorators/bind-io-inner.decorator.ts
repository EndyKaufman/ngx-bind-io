import { OnChanges, SimpleChanges } from '@angular/core';
import { getBindIOMetadata } from '../utils/bind-io-metadata-utils';

export class BindIoInnerLifecycle implements OnChanges {
  constructor(public originalNgOnChanges: Function) {}
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (!getBindIOMetadata(this).asInner.manualInputs) {
      getBindIOMetadata(this).asInner.manualInputs = {};
      if (simpleChanges) {
        Object.keys(simpleChanges).forEach(innerKey => (getBindIOMetadata(this).asInner.manualInputs[innerKey] = 1));
      }
    }
    if (typeof this.originalNgOnChanges === 'function') {
      this.originalNgOnChanges();
    }
  }
}
export function BindIoInner() {
  return function(target: Function) {
    const bindIoInnerLifecycle = new BindIoInnerLifecycle(target.prototype.ngOnChanges);
    target.prototype.ngOnChanges = bindIoInnerLifecycle.ngOnChanges;
  };
}
