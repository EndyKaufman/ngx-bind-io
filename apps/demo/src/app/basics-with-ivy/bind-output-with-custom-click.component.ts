import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'basic-bind-output-with-custom-click',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class WithIvyBasicBindOutputWithCustomClickComponent {
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

export class WithIvyBaseBasicBindOutputWithCustomClickHostComponent {
  isLoading$ = new BehaviorSubject(false);
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}

@Component({
  selector: 'basic-bind-output-with-custom-click-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-output-with-custom-click (start)="onStartButtonClick()" [propA]="propA">
    </basic-bind-output-with-custom-click>
    <hr />
    <basic-bind-output-with-custom-click [bindOutputs] [propA]="propA"></basic-bind-output-with-custom-click>
  `
})
export class WithIvyBasicBindOutputWithCustomClickHostComponent extends WithIvyBaseBasicBindOutputWithCustomClickHostComponent {
  propA = 'Prop A: defined';
  propB = 'Prop B: defined';
  onStartButtonClick() {
    alert(
      '"onStart" and "onStartClick" method not binded, because exists "onStartButtonClick" and custom rules for detect output method'
    );
  }
  onStartClick() {
    alert('"onStart" method not binded, because exists "onStartClick"');
  }
}
