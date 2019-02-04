import { OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { getBindIOMetadata, __ORIGINAL_NGONCHANGES__, __ORIGINAL_NGONDESTROY__ } from '../utils/bind-io-metadata-utils';

export class BindIoInnerLifecycle implements OnChanges, OnDestroy {
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
  ngOnDestroy() {
    Object.keys(getBindIOMetadata(this).asInner.subscriptions).forEach(subscriptionName =>
      getBindIOMetadata(this).asInner.subscriptions[subscriptionName].unsubscribe()
    );
    if (
      (this as any) &&
      (this as any)[__ORIGINAL_NGONDESTROY__] &&
      typeof (this as any)[__ORIGINAL_NGONDESTROY__] === 'function'
    ) {
      (this as any)[__ORIGINAL_NGONDESTROY__]();
    }
  }
}
export function BindIoInner() {
  return function (target: Function) {
    if (!target.prototype[__ORIGINAL_NGONCHANGES__]) {
      const bindIoInnerLifecycle = new BindIoInnerLifecycle();
      target.prototype[__ORIGINAL_NGONCHANGES__] = target.prototype.ngOnChanges;
      target.prototype[__ORIGINAL_NGONDESTROY__] = target.prototype.ngOnDestroy;
      target.prototype.ngOnChanges = bindIoInnerLifecycle.ngOnChanges;
      target.prototype.ngOnDestroy = bindIoInnerLifecycle.ngOnDestroy;
    }
  };
}
