import {
  ChangeDetectorRef,
  Directive,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
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
export class BindInputsDirective implements Partial<INgxBindIODirective>, OnChanges, OnInit, OnDestroy {
  @Input()
  bindInputs: INgxBindIOConfig | undefined;
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
    public viewContainerRef: ViewContainerRef,
    @Inject(NGX_BIND_IO_CONFIG) private _ngxBindIOConfig: INgxBindIOConfig,
    private _ngxBindInputsService: NgxBindInputsService,
    private _ngxBindIODebugService: NgxBindIODebugService,
    private _ref: ChangeDetectorRef
  ) {}
  ngOnChanges(simpleChanges: SimpleChanges) {
    this.detectComponents();
  }
  ngOnInit(): void {
    this.detectComponents();
    this.bindAll();
  }
  bindAll() {
    this.inputs = this._ngxBindInputsService.getInputs(this);
    this._ngxBindInputsService.bindInputs(this);
    this._ngxBindInputsService.bindObservableInputs(this);
    this._ngxBindIODebugService.showDebugInfo(this, this.debugIsActive());
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  bindValue(key: string, value: any) {
    this.component[key] = value;
    this._ref.markForCheck();
  }
  detectComponents() {
    if (!this.component && !this.parentComponent) {
      this.component = this.viewContainerRef['_data'].componentView.component;
      this.parentComponent = (<any>this.viewContainerRef)._view.context;
      if (this.parentComponent.$implicit !== undefined) {
        this.parentComponent = (<any>this.viewContainerRef)._view.component;
      }
    }
  }
  debugIsActive() {
    return (
      this._ngxBindIOConfig.debug ||
      (this.bindInputs && this.bindInputs.debug) ||
      (localStorage && localStorage.getItem('debug_ngx-bind-io') === 'true')
    ); // todo: remove on stable release
  }
}
