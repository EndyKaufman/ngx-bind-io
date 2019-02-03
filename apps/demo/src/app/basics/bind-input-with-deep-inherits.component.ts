import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BindIoInner } from 'ngx-bind-io';
import { BehaviorSubject } from 'rxjs';

export class BaseBaseBasicBindInputWithDeepInheritsComponent {
  @Input()
  isLoading = false;
  @Input()
  propA = 'Prop A: not defined';
  @Input()
  propB = 'Prop B: not defined';
}
export class BaseBasicBindInputWithDeepInheritsComponent extends BaseBaseBasicBindInputWithDeepInheritsComponent {
  @Output()
  start = new EventEmitter();
  onStart() {
    this.start.next(true);
  }
}
@BindIoInner()
@Component({
  selector: 'basic-bind-input-with-deep-inherits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class BasicBindInputWithDeepInheritsComponent extends BaseBasicBindInputWithDeepInheritsComponent {}

export class BaseBaseBasicBindInputWithDeepInheritsHostComponent {
  isLoading$ = new BehaviorSubject(false);
  propB: string = undefined;
}
export class BaseBasicBindInputWithDeepInheritsHostComponent extends BaseBaseBasicBindInputWithDeepInheritsHostComponent {
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}
@BindIoInner()
@Component({
  selector: 'basic-bind-input-with-deep-inherits-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-input-with-deep-inherits
      (start)="onStart()"
      [isLoading]="isLoading$ | async"
      [propA]="propA"
      [propB]="propB"
    >
    </basic-bind-input-with-deep-inherits>
    <hr />
    <basic-bind-input-with-deep-inherits [bindInputs] (start)="onStart()"> </basic-bind-input-with-deep-inherits>
  `
})
export class BasicBindInputWithDeepInheritsHostComponent extends BaseBasicBindInputWithDeepInheritsHostComponent {
  propA = 'Prop A: defined';
}
