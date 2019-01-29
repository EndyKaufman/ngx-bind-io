import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
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
import { NgxBindOutputsService } from '../services/ngx-bind-outputs.service';
import { getBindIOMetadata } from '../utils/bind-io-metadata-utils';

@Directive({
  selector: '[bindIO]'
})
export class BindIODirective implements INgxBindIODirective, OnChanges, OnInit, OnDestroy {
  @Input()
  bindIO: INgxBindIOConfig | undefined;
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

  innerComponent: any;
  hostComponent: any;
  inputs: {
    innerKeys: string[];
    hostKeys: string[];
  } = {
    innerKeys: [],
    hostKeys: []
  };
  outputs: {
    innerKeys: string[];
    hostKeys: string[];
  } = {
    innerKeys: [],
    hostKeys: []
  };

  usedInputs: { [key: string]: string } = {};
  usedOutputs: { [key: string]: string } = {};
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public viewContainerRef: ViewContainerRef,
    @Inject(NGX_BIND_IO_CONFIG) private _ngxBindIOConfig: INgxBindIOConfig,
    private _ngxBindInputsService: NgxBindInputsService,
    private _ngxBindOutputsService: NgxBindOutputsService,
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
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  bindValue(innerKey: string, value: any) {
    this.innerComponent[innerKey] = value;
    this._ref.markForCheck();
  }
  bindAll() {
    this.inputs = this._ngxBindInputsService.getInputs(this);
    this.outputs = this._ngxBindOutputsService.getOutputs(this);
    this._ngxBindInputsService.bindInputs(this);
    this._ngxBindInputsService.bindObservableInputs(this);
    this._ngxBindOutputsService.bindOutputs(this);
    this._ngxBindIODebugService.showDebugInfo(this, this.debugIsActive());
  }
  detectComponents() {
    if (!this.innerComponent && !this.hostComponent) {
      this.innerComponent = this.viewContainerRef['_data'].componentView.component;
      this.hostComponent = (<any>this.viewContainerRef)._view.context;
      if (this.hostComponent.$implicit !== undefined) {
        this.hostComponent = (<any>this.viewContainerRef)._view.component;
      }
      getBindIOMetadata(this.innerComponent).asInner.manualOutputs = {};
      Object.keys(this.innerComponent)
        .filter(
          innerKey =>
            this.innerComponent[innerKey] instanceof EventEmitter &&
            (this.innerComponent[innerKey] as EventEmitter<any>).observers.length > 0
        )
        .forEach(
          innerKey =>
            (getBindIOMetadata(this.innerComponent).asInner.manualOutputs[innerKey] = (this.innerComponent[
              innerKey
            ] as EventEmitter<any>).observers.length)
        );
    }
  }
  debugIsActive() {
    return (
      this._ngxBindIOConfig.debug ||
      (this.bindIO && this.bindIO.debug) ||
      (localStorage && localStorage.getItem('debug_ngx-bind-io') === 'true')
    ); // todo: remove on stable release
  }
}
