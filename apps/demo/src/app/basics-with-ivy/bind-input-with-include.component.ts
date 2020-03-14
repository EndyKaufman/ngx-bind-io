import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'basic-bind-input-with-include',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class WithIvyBasicBindInputWithIncludeComponent {
  @Input()
  isLoading = false;
  @Input()
  propA = 'Prop A: not defined';
  @Input()
  propB = 'Prop B: not defined';
  @Output()
  start = new EventEmitter();
  onStart() {
    this.start.next(true);
  }
}

export class WithIvyBaseBasicBindInputWithIncludeHostComponent {
  isLoading$ = new BehaviorSubject(false);
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}

@Component({
  selector: 'basic-bind-input-with-include-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-input-with-include (start)="onStart()" [isLoading]="isLoading$ | async" [propB]="propB">
    </basic-bind-input-with-include>
    <hr />
    <basic-bind-input-with-include
      [bindInputs]
      [includeInputs]="['propB']"
      (start)="onStart()"
      [isLoading]="isLoading$ | async"
    >
    </basic-bind-input-with-include>
  `
})
export class WithIvyBasicBindInputWithIncludeHostComponent extends WithIvyBaseBasicBindInputWithIncludeHostComponent {
  propA = 'Prop A: defined';
  propB = 'Prop B: defined';
}
