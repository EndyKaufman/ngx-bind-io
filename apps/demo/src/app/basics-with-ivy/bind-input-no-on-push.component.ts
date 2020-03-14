import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'basic-bind-input-no-on-push',
  template: `
    <div *ngIf="isLoading">Loading...</div>
    <button (click)="onStart()">Loading with 5s.</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class WithIvyBasicBindInputNoOnPushComponent {
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

export class WithIvyBaseBasicBindInputNoOnPushHostComponent {
  @ViewChild('inner1')
  inner1: WithIvyBasicBindInputNoOnPushComponent;
  @ViewChild('inner2')
  inner2: WithIvyBasicBindInputNoOnPushComponent;
  constructor(public changeDetectorRef: ChangeDetectorRef) {}
  onRun() {
    this.inner1.isLoading = true;
    this.inner2.isLoading = true;
    this.changeDetectorRef.markForCheck();
    setTimeout(_ => {
      this.inner1.isLoading = false;
      this.inner2.isLoading = false;
      this.changeDetectorRef.markForCheck();
    }, 5000);
  }
}

@Component({
  selector: 'basic-bind-input-no-on-push-host',
  template: `
    <basic-bind-input-no-on-push (start)="onRun()" [propA]="propA" [propB]="propB" #inner1>
    </basic-bind-input-no-on-push>
    <hr />
    <basic-bind-input-no-on-push [bindInputs] (start)="onRun()" #inner2> </basic-bind-input-no-on-push>
    <hr />
    <input [(ngModel)]="propA" />
    <input [(ngModel)]="propB" />
    <hr />
    <button (click)="loadingWith1500s()">Loading with 1,5s.</button>
  `
})
export class WithIvyBasicBindInputNoOnPushHostComponent extends WithIvyBaseBasicBindInputNoOnPushHostComponent {
  propA = 'Prop A: defined';
  get propB() {
    console.log('BasicBindInputNoOnPushHostComponent: Original getter propB', this._propB);
    return this._propB;
  }
  set propB(value: any) {
    console.log('BasicBindInputNoOnPushHostComponent: Original setter propB', value);
    this._propB = value;
  }
  _propB = 'Prop B: defined';
  constructor(public changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }
  loadingWith1500s() {
    this.inner1.isLoading = true;
    this.inner2.isLoading = true;
    this.changeDetectorRef.markForCheck();
    setTimeout(_ => {
      this.inner1.isLoading = false;
      this.inner2.isLoading = false;
      this.changeDetectorRef.markForCheck();
    }, 1500);
  }
}
