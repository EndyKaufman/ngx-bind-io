import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'basic-bind-one-to-many',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading">Loading...</div>
    <button (click)="onStart()">Loading with 5s.</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class WithIvyBasicBindOneToManyComponent {
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

export class WithIvyBaseBasicBindOneToManyHostComponent {
  isLoading$: Observable<boolean> = new Observable();
  onStart() {
    this.isLoading$ = new Observable(observer => {
      observer.next(true);
      setTimeout(_ => observer.next(false), 5000);
    });
  }
}

@Component({
  selector: 'basic-bind-one-to-many-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-one-to-many (start)="onStart()" [isLoading]="isLoading$ | async" [propA]="propA" [propB]="propB">
    </basic-bind-one-to-many>
    <br />
    <basic-bind-one-to-many (start)="onStart()" [isLoading]="isLoading$ | async" [propA]="propA" [propB]="propB">
    </basic-bind-one-to-many>
    <hr />
    <basic-bind-one-to-many [bindIO]></basic-bind-one-to-many>
    <br />
    <basic-bind-one-to-many [bindIO]="{ debug: true }"></basic-bind-one-to-many>
    <hr />
    <input [(ngModel)]="propA" />
    <input [(ngModel)]="propB" />
    <hr />
    <button (click)="loadingWith1500s()">Loading with 1,5s.</button>
  `
})
export class WithIvyBasicBindOneToManyHostComponent extends WithIvyBaseBasicBindOneToManyHostComponent {
  propA = 'Prop A: defined';
  get propB() {
    console.log('BasicBindOneToManyHostComponent: Original getter propB', this._propB);
    return this._propB;
  }
  set propB(value: any) {
    console.log('BasicBindOneToManyHostComponent: Original setter propB', value);
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
