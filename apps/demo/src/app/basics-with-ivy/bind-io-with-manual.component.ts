import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'basic-bind-io-with-manual',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class WithIvyBasicBindIOWithManualComponent {
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

export class WithIvyBaseBasicBindIOWithManualHostComponent {
  isLoading$ = new BehaviorSubject(false);
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}

@Component({
  selector: 'basic-bind-io-with-manual-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-io-with-manual
      (start)="onStartWithAlert()"
      [isLoading]="isLoading$ | async"
      [propA]="propA"
      propB="Manual binded propB"
    >
    </basic-bind-io-with-manual>
    <hr />
    <basic-bind-io-with-manual
      [bindIO]
      propB="Manual binded propB"
      (start)="onStartWithAlert()"
    ></basic-bind-io-with-manual>
  `
})
export class WithIvyBasicBindIOWithManualHostComponent extends WithIvyBaseBasicBindIOWithManualHostComponent {
  propA = 'Prop A: defined';
  propB = 'Prop B: defined';
  onStartWithAlert() {
    alert('Alert from manual binded @Output()');
    this.onStart();
  }
}
