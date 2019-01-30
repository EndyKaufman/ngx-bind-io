import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
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
export class BasicBindInputOnChangeComponent implements OnChanges {
  @Input()
  name: string;
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
  ngOnChanges(simpleChanges: SimpleChanges) {
    Object.keys(simpleChanges)
      .filter(simpleChange => simpleChanges[simpleChange].firstChange === false)
      .forEach(key => {
        alert(`${this.name}: Data from ngOnChanges for ${key}:${JSON.stringify(simpleChanges[key])}`);
      });
  }
}

export class BaseBasicBindInputOnChangeHostComponent {
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
  selector: 'basic-bind-input-on-change-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <basic-bind-input-on-change
      name="Without auto binding"
      (start)="onRun()"
      [isLoading]="isLoading$ | async"
      [propA]="propA"
      [propB]="propB"
    >
    </basic-bind-input-on-change>
    <hr />
    <basic-bind-input-on-change
      name="With auto binding"
      [bindInputs]
      (start)="onRun()"
      [propA]="propA"
    ></basic-bind-input-on-change>
    <hr />
    <input [(ngModel)]="propA" />
    <input [(ngModel)]="propB" />
    <hr />
    <button (click)="loadingWith1500s()">Loading with 1,5s.</button>
  `
})
export class BasicBindInputOnChangeHostComponent extends BaseBasicBindInputOnChangeHostComponent {
  propA = 'Prop A: defined';
  get propB() {
    console.log('BasicBindInputOnChangeHostComponent: Original getter propB', this._propB);
    return this._propB;
  }
  set propB(value: any) {
    console.log('BasicBindInputOnChangeHostComponent: Original setter propB', value);
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
