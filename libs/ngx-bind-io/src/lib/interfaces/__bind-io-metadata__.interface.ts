import { Subject, Subscription } from 'rxjs';

export interface IBindIOMetadata {
  asHost: {
    subjects: { [key: string]: Subject<any> };
  };
  asInner: {
    subscriptions: { [key: string]: Subscription };
  };
}
