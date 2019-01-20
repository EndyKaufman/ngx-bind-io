import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class BaseBaseBasicBindIOWithMixinsComponent {
  @Input()
  isLoading = false;
  @Input()
  propA = 'Prop A: not defined';
  @Input()
  propB = 'Prop B: not defined';
}
export class BaseBasicBindIOWithMixinsComponent extends BaseBaseBasicBindIOWithMixinsComponent {
  @Output()
  start = new EventEmitter();
  onStart() {
    this.start.next(true);
  }
}
@Component({
  selector: 'basic-bind-io-with-mixins',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class BasicBindIOWithMixinsComponent extends BaseBasicBindIOWithMixinsComponent {
  start: EventEmitter<{}>;
  onStart: () => void;
  isLoading: boolean;
  propA: string;
  propB: string;
}

type Constructor<T> = new (...args: any[]) => T;
class EmptyClass {}

function Base1BasicBindIOWithMixinsParentComponent<T extends Constructor<{}>>(base?: T) {
  if (!base) {
    base = EmptyClass as any;
  }
  return class extends base {
    propA = 'Prop A: defined';
    propB = 'Prop B: defined';
  };
}
function Base2BasicBindIOWithMixinsParentComponent<T extends Constructor<{}>>(base?: T) {
  if (!base) {
    base = EmptyClass as any;
  }
  return class extends base {
    isLoading$ = new BehaviorSubject(false);
    onStart() {
      this.isLoading$.next(true);
      setTimeout(() => this.isLoading$.next(false), 5000);
    }
  };
}
@Component({
  selector: 'basic-bind-io-with-mixins-parent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-io-with-mixins (start)="onStart()" [isLoading]="isLoading$ | async" [propA]="propA" [propB]="propB">
    </basic-bind-io-with-mixins>
    <hr />
    <basic-bind-io-with-mixins bindIO></basic-bind-io-with-mixins>
  `
})
export class BasicBindIOWithMixinsParentComponent extends Base1BasicBindIOWithMixinsParentComponent(
  Base2BasicBindIOWithMixinsParentComponent()
) {}
