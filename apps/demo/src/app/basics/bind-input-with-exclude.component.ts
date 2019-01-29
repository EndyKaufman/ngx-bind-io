import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BindIoInner } from 'ngx-bind-io';
import { BehaviorSubject } from 'rxjs';
@BindIoInner()
@Component({
  selector: 'basic-bind-input-with-exclude',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class BasicBindInputWithExcludeComponent {
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

export class BaseBasicBindInputWithExcludeHostComponent {
  isLoading$ = new BehaviorSubject(false);
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}
@BindIoInner()
@Component({
  selector: 'basic-bind-input-with-exclude-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-input-with-exclude (start)="onStart()" [isLoading]="isLoading$ | async" [propB]="propB">
    </basic-bind-input-with-exclude>
    <hr />
    <basic-bind-input-with-exclude
      [bindInputs]
      excludeInputs="propA"
      (start)="onStart()"
    ></basic-bind-input-with-exclude>
  `
})
export class BasicBindInputWithExcludeHostComponent extends BaseBasicBindInputWithExcludeHostComponent {
  propA = 'Prop A: defined';
  propB = 'Prop B: defined';
}
