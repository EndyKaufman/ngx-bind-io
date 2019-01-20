import { AfterContentInit, ChangeDetectorRef, Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { IBindIO } from '../interfaces/bind-io.interface';
import { NgxBindInputsService } from '../services/ngx-bind-inputs.service';
import { NgxBindOutputsService } from '../services/ngx-bind-outputs.service';

@Directive({
  selector: '[bindIO]'
})
export class BindIODirective implements IBindIO, OnDestroy, AfterContentInit {
  @Input()
  excludeInputs: string[] | string = [];
  @Input()
  includeInputs: string[] | string = [];
  @Input()
  excludeOutputs: string[] | string = [];
  @Input()
  includeOutputs: string[] | string = [];

  component: any;
  parentComponent: any;
  inputs: {
    keys: string[];
    parentKeys: string[];
  };
  outputs: {
    keys: string[];
    parentKeys: string[];
  };

  used: string[] = [];
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _ngxBindInputsService: NgxBindInputsService,
    private _ngxBindOutputsService: NgxBindOutputsService,
    private _ref: ChangeDetectorRef
  ) {}
  ngAfterContentInit() {
    this.component = this._viewContainerRef['_data'].componentView.component;
    this.parentComponent = (<any>this._viewContainerRef)._view.context;
    this.inputs = this._ngxBindInputsService.getInputs(this);
    this.outputs = this._ngxBindOutputsService.getOutputs(this);
    this._ngxBindInputsService.bindInputs(this);
    this._ngxBindInputsService.bindObservableInputs(this);
    this._ngxBindOutputsService.bindOutputs(this);
    if (localStorage && localStorage.getItem('debug_ngx-bind-io') === 'true') {
      console.log(this.inputs, this.outputs, this);
    }
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  bindValue(key: string, value: any) {
    this.component[key] = value;
    this._ref.markForCheck();
  }
}
