import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'basic-bind-output-with-click',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class BasicBindOutputWithClickComponent {
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

export class BaseBasicBindOutputWithClickParentComponent {
  isLoading$ = new BehaviorSubject(false);
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}
@Component({
  selector: 'basic-bind-output-with-click-parent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-output-with-click (start)="onStartClick()" [propA]="propA"> </basic-bind-output-with-click>
    <hr />
    <basic-bind-output-with-click bindOutputs [propA]="propA"></basic-bind-output-with-click>
  `
})
export class BasicBindOutputWithClickParentComponent extends BaseBasicBindOutputWithClickParentComponent {
  propA = 'Prop A: defined';
  propB = 'Prop B: defined';
  onStartClick() {
    alert('"onStart" method not binded, because exists "onStartClick"');
  }
}
