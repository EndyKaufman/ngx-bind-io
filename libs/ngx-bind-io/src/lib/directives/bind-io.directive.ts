import {
  ApplicationRef,
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
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
  };

  usedInputs: { [key: string]: string } = {};
  usedOutputs: { [key: string]: string } = {};
  destroyed$: Subject<boolean> = new Subject<boolean>();
  innerSimpleChanges: SimpleChanges = {};

  ignoreKeysManualBinded: boolean;

  constructor(
    public viewContainerRef: ViewContainerRef,
    @Inject(NGX_BIND_IO_CONFIG) private _ngxBindIOConfig: INgxBindIOConfig,
    private _ngxBindInputsService: NgxBindInputsService,
    private _ngxBindOutputsService: NgxBindOutputsService,
    private _ngxBindIODebugService: NgxBindIODebugService,
    private _detectorRef: ChangeDetectorRef
  ) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.detectComponents();
  }
  ngOnInit() {
    this.detectComponents();
    this.bindAll();
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  bindValue(innerKey: string, value: any) {
    const previousValue = this.innerComponent[innerKey];
    this.innerComponent[innerKey] = value;
    if (this._detectorRef && typeof this._detectorRef.markForCheck === 'function') {
      this._detectorRef.markForCheck();
    }
    if (this._detectorRef instanceof ApplicationRef) {
      setTimeout(() => ((this._detectorRef as any) as ApplicationRef).tick(), 0);
    }
    if (!this._detectorRef) {
      Object.keys(this.innerComponent).forEach(key => {
        if (this.innerComponent[key] instanceof ChangeDetectorRef) {
          this.innerComponent[key].markForCheck();
        }
      });
    }
    if (typeof this.innerComponent['ngOnChanges'] === 'function') {
      const simpleChange = new SimpleChange(previousValue, value, this.innerSimpleChanges[innerKey] === undefined);
      this.innerComponent['ngOnChanges']({ [innerKey]: simpleChange });
      this.innerSimpleChanges[innerKey] = simpleChange;
    }
  }
  bindAll() {
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

    this.inputs = this._ngxBindInputsService.getInputs(this);
    this._ngxBindInputsService.bindInputs(this);
    this._ngxBindInputsService.bindObservableInputs(this);

    this.outputs = this._ngxBindOutputsService.getOutputs(this);
    this._ngxBindOutputsService.bindOutputs(this);
    this._ngxBindIODebugService.showDebugInfo(this, this.debugIsActive());
  }
  detectComponents() {
    if (this.viewContainerRef && !this.innerComponent && !this.hostComponent) {
      this.innerComponent = this.viewContainerRef['_data'].componentView.component;
      this.hostComponent = (<any>this.viewContainerRef)._view.context;
      if (this.hostComponent.$implicit !== undefined) {
        this.hostComponent = (<any>this.viewContainerRef)._view.component;
      }
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
