import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'basic-bind-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class WithIvyBasicBindInputComponent {
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

export class WithIvyBaseBasicBindInputHostComponent {
  isLoading$ = new BehaviorSubject(false);
  onRun() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}

@Component({
  selector: 'basic-bind-input-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-input (start)="onRun()" [isLoading]="isLoading$ | async" [propA]="propA" [propB]="propB">
    </basic-bind-input>
    <hr />
    <basic-bind-input [bindInputs] (start)="onRun()"></basic-bind-input>
  `
})
export class WithIvyBasicBindInputHostComponent extends WithIvyBaseBasicBindInputHostComponent {
  propA = 'Prop A: defined';
  propB = 'Prop B: defined';
}
