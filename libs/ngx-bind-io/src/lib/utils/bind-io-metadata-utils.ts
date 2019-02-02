import { INgxBindIOMetadata } from '../interfaces/ngx-bind-io-metadata.interface';

export const __BIND_IO__ = '__bindIO__';
export const __ORIGINAL_NGONCHANGES__ = '__originalNgOnChanges__';

export function getBindIOMetadata(component: any) {
  const emptyMetadata: INgxBindIOMetadata = {
    asHost: {
      subjects: {}
    },
    asInner: {
      subscriptions: {},
      manualInputs: undefined,
      manualOutputs: undefined
    }
  };
  if (component) {
    if (!component[__BIND_IO__]) {
      (component[__BIND_IO__] as INgxBindIOMetadata) = emptyMetadata;
    }
    return component[__BIND_IO__] as INgxBindIOMetadata;
  }
  return emptyMetadata;
}
