import { AfterContentInit, ChangeDetectorRef, Directive, Inject, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { INgxBindIOConfig } from '../interfaces/ngx-bind-io-config.interface';
import { INgxBindIODirective } from '../interfaces/ngx-bind-io-directive.interface';
import { NGX_BIND_IO_CONFIG } from '../ngx-bind-io.config';
import { NgxBindIODebugService } from '../services/ngx-bind-io-debug.service';
import { NgxBindOutputsService } from '../services/ngx-bind-outputs.service';
@Directive({
  selector: '[bindOutputs]'
})
export class BindOutputsDirective implements Partial<INgxBindIODirective>, OnDestroy, AfterContentInit {
  @Input()
  bindOutputs?: INgxBindIOConfig;
  @Input()
  excludeOutputs: string[] | string = [];
  @Input()
  includeOutputs: string[] | string = [];

  component: any;
  parentComponent: any;
  outputs: {
    keys: string[];
    parentKeys: string[];
  } = {
      keys: [],
      parentKeys: []
    };

  usedOutputs: { [key: string]: string } = {};
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(NGX_BIND_IO_CONFIG) private _ngxBindIOConfig: INgxBindIOConfig,
    private _viewContainerRef: ViewContainerRef,
    private _ngxBindOutputsService: NgxBindOutputsService,
    private _ngxBindIODebugService: NgxBindIODebugService,
    private _ref: ChangeDetectorRef
  ) { }
  ngAfterContentInit() {
    this.component = this._viewContainerRef['_data'].componentView.component;
    this.parentComponent = (<any>this._viewContainerRef)._view.context;
    this.outputs = this._ngxBindOutputsService.getOutputs(this);
    this._ngxBindOutputsService.bindOutputs(this);
    const debug = this._ngxBindIOConfig.debug ||
      (this.bindOutputs && this.bindOutputs.debug) ||
      (localStorage && localStorage.getItem('debug_ngx-bind-io') === 'true'); // todo: remove on stable release
    this._ngxBindIODebugService.showDebugInfo(this, debug);
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
