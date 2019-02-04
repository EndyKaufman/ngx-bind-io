import { OnChanges, SimpleChanges } from '@angular/core';
import { getBindIOMetadata, __ORIGINAL_NGONCHANGES__ } from '../utils/bind-io-metadata-utils';

export class BindIoInnerLifecycle implements OnChanges {
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (!getBindIOMetadata(this).asInner.manualInputs) {
      getBindIOMetadata(this).asInner.manualInputs = {};
      if (simpleChanges) {
        Object.keys(simpleChanges).forEach(innerKey => (getBindIOMetadata(this).asInner.manualInputs[innerKey] = 1));
      }
    }
    if (
      (this as any) &&
      (this as any)[__ORIGINAL_NGONCHANGES__] &&
      typeof (this as any)[__ORIGINAL_NGONCHANGES__] === 'function'
    ) {
      (this as any)[__ORIGINAL_NGONCHANGES__](simpleChanges);
    }
  }
}
export function BindIoInner() {
  return function(target: Function) {
    if (!target.prototype[__ORIGINAL_NGONCHANGES__]) {
      const bindIoInnerLifecycle = new BindIoInnerLifecycle();
      target.prototype[__ORIGINAL_NGONCHANGES__] = target.prototype.ngOnChanges;
      target.prototype.ngOnChanges = bindIoInnerLifecycle.ngOnChanges;
    }
  };
}
