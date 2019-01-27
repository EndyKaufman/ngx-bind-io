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

@Directive({
  selector: '[bindInputs]'
})
export class BindInputsDirective implements Partial<INgxBindIODirective>, OnDestroy, AfterContentInit {
  @Input()
  bindInputs?: INgxBindIOConfig;
  @Input()
  excludeInputs: string[] | string = [];
  @Input()
  includeInputs: string[] | string = [];

  component: any;
  parentComponent: any;
  inputs: {
    keys: string[];
    parentKeys: string[];
  } = {
    keys: [],
    parentKeys: []
  };

  usedInputs: { [key: string]: string } = {};
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(NGX_BIND_IO_CONFIG) private _ngxBindIOConfig: INgxBindIOConfig,
    private _viewContainerRef: ViewContainerRef,
    private _ngxBindInputsService: NgxBindInputsService,
    private _ngxBindIODebugService: NgxBindIODebugService,
    private _ref: ChangeDetectorRef
  ) {}
  ngAfterContentInit() {
    this.component = this._viewContainerRef['_data'].componentView.component;
    this.parentComponent = (<any>this._viewContainerRef)._view.context;
    if (this.parentComponent.$implicit !== undefined) {
      this.parentComponent = (<any>this._viewContainerRef)._view.component;
    }
    this.inputs = this._ngxBindInputsService.getInputs(this);
    this._ngxBindInputsService.bindInputs(this);
    this._ngxBindInputsService.bindObservableInputs(this);
    const debug =
      this._ngxBindIOConfig.debug ||
      (this.bindInputs && this.bindInputs.debug) ||
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
