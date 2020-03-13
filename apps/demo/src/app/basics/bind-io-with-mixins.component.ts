import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BindIoInner } from 'ngx-bind-io';
import { BehaviorSubject } from 'rxjs';
import { Mixin } from 'ts-mixer';

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
@BindIoInner()
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
@BindIoInner()
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
export class BasicBindIOWithMixinsHostComponent extends Mixin(
  Base2BasicBindIOWithMixinsHostComponent,
  Base1BasicBindIOWithMixinsHostComponent
) {}
