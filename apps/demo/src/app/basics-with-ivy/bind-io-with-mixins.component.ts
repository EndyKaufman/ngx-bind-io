import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Mixin } from 'ts-mixer';

export class WithIvyBaseBaseBasicBindIOWithMixinsComponent {
  @Input()
  isLoading = false;
  @Input()
  propA = 'Prop A: not defined';
  @Input()
  propB = 'Prop B: not defined';
}
export class WithIvyBaseBasicBindIOWithMixinsComponent extends WithIvyBaseBaseBasicBindIOWithMixinsComponent {
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
export class WithIvyBasicBindIOWithMixinsComponent extends WithIvyBaseBasicBindIOWithMixinsComponent {
  start: EventEmitter<{}>;
  onStart: () => void;
  isLoading: boolean;
  propA: string;
  propB: string;
}

class Base1BasicBindIOWithMixinsHostComponent {
  propA = 'Prop A: defined';
  propB = 'Prop B: defined';
}

class Base2BasicBindIOWithMixinsHostComponent {
  isLoading$ = new BehaviorSubject(false);
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}

@Component({
  selector: 'basic-bind-io-with-mixins-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-io-with-mixins (start)="onStart()" [isLoading]="isLoading$ | async" [propA]="propA" [propB]="propB">
    </basic-bind-io-with-mixins>
    <hr />
    <basic-bind-io-with-mixins [bindIO]></basic-bind-io-with-mixins>
  `
})
export class WithIvyBasicBindIOWithMixinsHostComponent extends Mixin(
  Base2BasicBindIOWithMixinsHostComponent,
  Base1BasicBindIOWithMixinsHostComponent
) {}
