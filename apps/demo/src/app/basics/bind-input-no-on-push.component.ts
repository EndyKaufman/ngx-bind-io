import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BindIoInner } from 'ngx-bind-io';
@BindIoInner()
@Component({
  selector: 'basic-bind-input-no-on-push',
  template: `
    <div *ngIf="isLoading">Loading...</div>
    <button (click)="onStart()">Loading with 5s.</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class BasicBindInputNoOnPushComponent {
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

export class BaseBasicBindInputNoOnPushParentComponent {
  @ViewChild('child1')
  child1: BasicBindInputNoOnPushComponent;
  @ViewChild('child2')
  child2: BasicBindInputNoOnPushComponent;
  constructor(public changeDetectorRef: ChangeDetectorRef) { }
  onRun() {
    this.child1.isLoading = true;
    this.child2.isLoading = true;
    this.changeDetectorRef.markForCheck();
    setTimeout(_ => {
      this.child1.isLoading = false;
      this.child2.isLoading = false;
      this.changeDetectorRef.markForCheck();
    }, 5000);
  }
}
@BindIoInner()
@Component({
  selector: 'basic-bind-input-no-on-push-parent',
  template: `
    <basic-bind-input-no-on-push (start)="onRun()" [propA]="propA" [propB]="propB" #child1>
    </basic-bind-input-no-on-push>
    <hr />
    <basic-bind-input-no-on-push [bindInputs] (start)="onRun()" #child2> </basic-bind-input-no-on-push>
    <hr />
    <input [(ngModel)]="propA" />
    <input [(ngModel)]="propB" />
    <hr />
    <button (click)="loadingWith1500s()">Loading with 1,5s.</button>
  `
})
export class BasicBindInputNoOnPushParentComponent extends BaseBasicBindInputNoOnPushParentComponent {
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
  constructor(public changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }
  loadingWith1500s() {
    this.child1.isLoading = true;
    this.child2.isLoading = true;
    this.changeDetectorRef.markForCheck();
    setTimeout(_ => {
      this.child1.isLoading = false;
      this.child2.isLoading = false;
      this.changeDetectorRef.markForCheck();
    }, 1500);
  }
}
