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
import { NgxBindIODebugService } from '../services/ngx-bind-io-debug.service';
import { NgxBindOutputsService } from '../services/ngx-bind-outputs.service';
import { getBindIOMetadata } from '../utils/bind-io-metadata-utils';
@Directive({
  selector: '[bindOutputs]'
})
export class BindOutputsDirective implements Partial<INgxBindIODirective>, OnChanges, OnInit, OnDestroy {
  @Input()
  bindOutputs: INgxBindIOConfig | undefined;
  @Input()
  excludeOutputs: string[] | string = [];
  @Input()
  includeOutputs: string[] | string = [];

  innerComponent: any;
  hostComponent: any;
  outputs: {
    innerKeys: string[];
    hostKeys: string[];
  };

  usedOutputs: { [key: string]: string } = {};
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public viewContainerRef: ViewContainerRef,
    @Inject(NGX_BIND_IO_CONFIG) private _ngxBindIOConfig: INgxBindIOConfig,
    private _ngxBindOutputsService: NgxBindOutputsService,
    private _ngxBindIODebugService: NgxBindIODebugService,
    private _ref: ChangeDetectorRef
  ) {}
  ngOnChanges(simpleChanges: SimpleChanges) {
    this.detectComponents();
  }
  ngOnInit() {
    this.detectComponents();
    this.bindAll();
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
    if (this.outputs === undefined) {
      this.outputs = this._ngxBindOutputsService.getOutputs(this);
      this._ngxBindOutputsService.bindOutputs(this);
      this._ngxBindIODebugService.showDebugInfo(this, this.debugIsActive());
    }
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
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
    return this._ngxBindIOConfig.debug || (this.bindOutputs && this.bindOutputs.debug);
  }
}
