import { INgxBindIOMetadata } from '../interfaces/ngx-bind-io-metadata.interface';

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
    if (!component['__bindIO__']) {
      (component['__bindIO__'] as INgxBindIOMetadata) = emptyMetadata;
    }
    return component['__bindIO__'] as INgxBindIOMetadata;
  }
  return emptyMetadata;
}
