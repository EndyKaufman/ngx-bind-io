import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Input, OnDestroy, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BindIoInner, NgxBindIoService } from 'ngx-bind-io';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class BaseBaseBasicBindInputWithDeepInheritsModalComponent {
  @Input()
  isLoading = false;
  @Input()
  propA = 'Prop A: not defined';
  @Input()
  propB = 'Prop B: not defined';
}
export class BaseBasicBindInputWithDeepInheritsModalComponent extends BaseBaseBasicBindInputWithDeepInheritsModalComponent {
  @Output()
  start = new EventEmitter();
  onStart() {
    this.start.next(true);
  }
}
@BindIoInner()
@Component({
  selector: 'basic-bind-input-with-deep-inherits-modal',
  // changeDetection: ChangeDetectionStrategy.OnPush, // <-- OnPush change detection for dynamic components not work
  template: `
    <div *ngIf="isLoading">Loading... (5s)</div>
    <button (click)="onStart()">Start</button> <br />
    {{ propA }} <br />
    {{ propB }}
  `
})
export class BasicBindInputWithDeepInheritsModalComponent extends BaseBasicBindInputWithDeepInheritsModalComponent { }

export class BaseBaseBasicBindInputWithDeepInheritsModalHostComponent {
  isLoading$ = new BehaviorSubject(false);
  propB: string;
}
export class BaseBasicBindInputWithDeepInheritsModalHostComponent extends BaseBaseBasicBindInputWithDeepInheritsModalHostComponent {
  onStart() {
    this.isLoading$.next(true);
    setTimeout(() => this.isLoading$.next(false), 5000);
  }
}
@BindIoInner()
@Component({
  selector: 'basic-bind-input-with-deep-inherits-modal-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<small style="color:orange">
After update inputs on host changes not applied in inner<br/>
</small>
<button
    mat-raised-button
    (click)="createWithoutBindIO()">
Create component without bindIO
</button>
<br/>
<template #withoutBindIO></template>
<br/>
<small style="color:orange">
Binding work only with ChangeDetectionStrategy.Default on modal component<br/>
</small>
<button
    mat-raised-button
    (click)="openDialogWithoutBindIO()">
Show modal without bindIO
</button>
<hr/>
<small style="color:orange">
Binding work only with ChangeDetectionStrategy.Default on modal component<br/>
</small>
<button
    mat-raised-button
    (click)="createWithBindIO()">
Create component with bindIO
</button>
<br/>
<template #withBindIO></template>
<br/>
<small style="color:orange">
Binding work only with ChangeDetectionStrategy.Default on modal component<br/>
</small>
<button
    mat-raised-button
    (click)="openDialogWitBindIO()">
Show modal with bindIO
</button>
<hr />
<input [(ngModel)]="propA" />
<input [(ngModel)]="propB" />
  `
})
export class BasicBindInputWithDeepInheritsModalHostComponent extends
  BaseBasicBindInputWithDeepInheritsModalHostComponent implements OnDestroy {

  @ViewChild('withoutBindIO', { read: ViewContainerRef })
  withoutBindIO: ViewContainerRef;
  @ViewChild('withBindIO', { read: ViewContainerRef })
  withBindIO: ViewContainerRef;

  propA = 'Prop A: defined';
  destroyed$: Subject<boolean> = new Subject<boolean>();
  constructor(
    public dialog: MatDialog,
    private _ngxBindIoService: NgxBindIoService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _resolver: ComponentFactoryResolver
  ) {
    super();
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  createWithoutBindIO() {
    this.withoutBindIO.clear();
    const factory = this._resolver.resolveComponentFactory(BasicBindInputWithDeepInheritsModalComponent);
    const componentRef = this.withoutBindIO.createComponent(factory);
    componentRef.instance.propA = this.propA;
    componentRef.instance.propB = this.propB;
    componentRef.instance.start.subscribe(
      $event =>
        this.onStart()
    );
    this.isLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        isLoading => {
          if (componentRef.instance) {
            componentRef.instance.isLoading = isLoading;
            this._changeDetectorRef.detectChanges();
          }
        });
  }
  openDialogWithoutBindIO() {
    const dialogRef = this.dialog.open(BasicBindInputWithDeepInheritsModalComponent, {
      width: '250px'
    });
    dialogRef.componentInstance.propA = this.propA;
    dialogRef.componentInstance.propB = this.propB;
    dialogRef.componentInstance.start.subscribe(
      $event =>
        this.onStart()
    );
    this.isLoading$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        isLoading => {
          if (dialogRef.componentInstance) {
            dialogRef.componentInstance.isLoading = isLoading;
          }
        });
  }
  createWithBindIO() {
    this.withBindIO.clear();
    const factory = this._resolver.resolveComponentFactory(BasicBindInputWithDeepInheritsModalComponent);
    const componentRef = this.withBindIO.createComponent(factory);
    this._ngxBindIoService.linkHostToInner(
      this,
      componentRef.instance,
      { propA: this.propA, propB: this.propB },
      this._changeDetectorRef
    );
  }
  openDialogWitBindIO() {
    const dialogRef = this.dialog.open(BasicBindInputWithDeepInheritsModalComponent, {
      width: '250px'
    });
    this._ngxBindIoService.linkHostToInner(
      this,
      dialogRef.componentInstance,
      { propA: this.propA, propB: this.propB }
    );
  }
}
