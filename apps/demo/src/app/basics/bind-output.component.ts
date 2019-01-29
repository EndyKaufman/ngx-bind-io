import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BindIoInner } from 'ngx-bind-io';
import { BehaviorSubject } from 'rxjs';
@BindIoInner()
@Component({
  selector: 'basic-bind-output',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class BasicBindOutputComponent {
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

export class BaseBasicBindOutputParentComponent {
  isLoading$ = new BehaviorSubject(false);
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}
@BindIoInner()
@Component({
  selector: 'basic-bind-output-parent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-output (start)="onStart()" [isLoading]="isLoading$ | async" [propA]="propA"> </basic-bind-output>
    <hr />
    <basic-bind-output [bindOutputs] [isLoading]="isLoading$ | async" [propA]="propA"></basic-bind-output>
  `
})
export class BasicBindOutputParentComponent extends BaseBasicBindOutputParentComponent {
  propA = 'Prop A: defined';
  propB = 'Prop B: defined';
}
