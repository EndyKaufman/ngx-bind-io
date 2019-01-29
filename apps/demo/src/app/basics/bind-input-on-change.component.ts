import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BindIoInner } from 'ngx-bind-io';
import { Observable } from 'rxjs';
@BindIoInner()
@Component({
  selector: 'basic-bind-input-on-change',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading...</div>
    <button (click)="onStart()">Loading with 5s.</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class BasicBindInputOnChangeComponent {
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

export class BaseBasicBindInputOnChangeParentComponent {
  isLoading$: Observable<boolean> = new Observable();
  onRun() {
    this.isLoading$ = new Observable(observer => {
      observer.next(true);
      setTimeout(_ => observer.next(false), 5000);
    });
  }
}
@BindIoInner()
@Component({
  selector: 'basic-bind-input-on-change-parent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-input-on-change (start)="onRun()" [isLoading]="isLoading$ | async" [propA]="propA" [propB]="propB">
    </basic-bind-input-on-change>
    <hr />
    <basic-bind-input-on-change [bindInputs] (start)="onRun()"></basic-bind-input-on-change>
    <hr />
    <input [(ngModel)]="propA" />
    <input [(ngModel)]="propB" />
    <hr />
    <button (click)="loadingWith1500s()">Loading with 1,5s.</button>
  `
})
export class BasicBindInputOnChangeParentComponent extends BaseBasicBindInputOnChangeParentComponent {
  propA = 'Prop A: defined';
  get propB() {
    console.log('Original getter propB', this._propB);
    return this._propB;
  }
  set propB(value: any) {
    console.log('Original setter propB', value);
    this._propB = value;
  }
  _propB = 'Prop B: defined';
  loadingWith1500s() {
    this.isLoading$ = new Observable(observer => {
      observer.next(true);
      setTimeout(_ => observer.next(false), 1500);
    });
  }
}
