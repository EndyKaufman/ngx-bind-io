import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  Inject,
  Input,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { INgxBindIOConfig } from '../interfaces/ngx-bind-io-config.interface';
import { INgxBindIODirective } from '../interfaces/ngx-bind-io-directive.interface';
import { NGX_BIND_IO_CONFIG } from '../ngx-bind-io.config';
import { NgxBindInputsService } from '../services/ngx-bind-inputs.service';
import { NgxBindIODebugService } from '../services/ngx-bind-io-debug.service';
import { NgxBindOutputsService } from '../services/ngx-bind-outputs.service';

@Directive({
  selector: '[bindIO]'
})
export class BindIODirective implements INgxBindIODirective, OnDestroy, AfterContentInit {
  @Input()
  bindIO?: INgxBindIOConfig;
  @Input()
  excludeIO: string[] | string = [];
  @Input()
  includeIO: string[] | string = [];
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
  } = {
      keys: [],
      parentKeys: []
    };
  outputs: {
    keys: string[];
    parentKeys: string[];
  } = {
      keys: [],
      parentKeys: []
    };

  usedInputs: { [key: string]: string } = {};
  usedOutputs: { [key: string]: string } = {};
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(NGX_BIND_IO_CONFIG) private _ngxBindIOConfig: INgxBindIOConfig,
    private _viewContainerRef: ViewContainerRef,
    private _ngxBindInputsService: NgxBindInputsService,
    private _ngxBindOutputsService: NgxBindOutputsService,
    private _ngxBindIODebugService: NgxBindIODebugService,
    private _ref: ChangeDetectorRef
  ) { }
  ngAfterContentInit() {
    this.component = this._viewContainerRef['_data'].componentView.component;
    this.parentComponent = (<any>this._viewContainerRef)._view.context;
    if (this.parentComponent.$implicit !== undefined) {
      this.parentComponent = (<any>this._viewContainerRef)._view.component;
    }
    this.inputs = this._ngxBindInputsService.getInputs(this);
    this.outputs = this._ngxBindOutputsService.getOutputs(this);
    this._ngxBindInputsService.bindInputs(this);
    this._ngxBindInputsService.bindObservableInputs(this);
    this._ngxBindOutputsService.bindOutputs(this);
    const debug =
      this._ngxBindIOConfig.debug ||
      (this.bindIO && this.bindIO.debug) ||
      (localStorage && localStorage.getItem('debug_ngx-bind-io') === 'true'); // todo: remove on stable release
    this._ngxBindIODebugService.showDebugInfo(this, debug);
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
