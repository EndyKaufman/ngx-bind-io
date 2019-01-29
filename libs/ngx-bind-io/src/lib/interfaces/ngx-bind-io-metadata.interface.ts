import { Subject, Subscription } from 'rxjs';

export interface INgxBindIOMetadata {
  asHost: {
    subjects: { [key: string]: Subject<any> };
  };
  asInner: {
    manualOutputs: { [key: string]: number };
    manualInputs: { [key: string]: number };
    subscriptions: { [key: string]: Subscription };
  };
}
