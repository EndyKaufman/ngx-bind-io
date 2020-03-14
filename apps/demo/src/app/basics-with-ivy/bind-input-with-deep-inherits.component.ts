import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class WithIvyBaseBaseBasicBindInputWithDeepInheritsComponent {
  @Input()
  isLoading = false;
  @Input()
  propA = 'Prop A: not defined';
  @Input()
  propB = 'Prop B: not defined';
}
export class WithIvyBaseBasicBindInputWithDeepInheritsComponent extends WithIvyBaseBaseBasicBindInputWithDeepInheritsComponent {
  @Output()
  start = new EventEmitter();
  onStart() {
    this.start.next(true);
  }
}

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
export class WithIvyBasicBindInputWithDeepInheritsComponent extends WithIvyBaseBasicBindInputWithDeepInheritsComponent {}

export class WithIvyBaseBaseBasicBindInputWithDeepInheritsHostComponent {
  isLoading$ = new BehaviorSubject(false);
  propB: string = undefined;
}
export class WithIvyBaseBasicBindInputWithDeepInheritsHostComponent extends WithIvyBaseBaseBasicBindInputWithDeepInheritsHostComponent {
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}

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
export class WithIvyBasicBindInputWithDeepInheritsHostComponent extends WithIvyBaseBasicBindInputWithDeepInheritsHostComponent {
  propA = 'Prop A: defined';
}
