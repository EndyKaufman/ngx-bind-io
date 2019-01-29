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
    public viewContainerRef: ViewContainerRef,
    @Inject(NGX_BIND_IO_CONFIG) private _ngxBindIOConfig: INgxBindIOConfig,
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
  bindAll() {
    this.outputs = this._ngxBindOutputsService.getOutputs(this);
    this._ngxBindOutputsService.bindOutputs(this);
    this._ngxBindIODebugService.showDebugInfo(this, this.debugIsActive());
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  detectComponents() {
    if (!this.component && !this.parentComponent) {
      this.component = this.viewContainerRef['_data'].componentView.component;
      this.parentComponent = (<any>this.viewContainerRef)._view.context;
      if (this.parentComponent.$implicit !== undefined) {
        this.parentComponent = (<any>this.viewContainerRef)._view.component;
      }
      getBindIOMetadata(this.component).asInner.manualOutputs = {};
      Object.keys(this.component)
        .filter(
          key =>
            this.component[key] instanceof EventEmitter &&
            (this.component[key] as EventEmitter<any>).observers.length > 0
        )
        .forEach(
          key =>
            (getBindIOMetadata(this.component).asInner.manualOutputs[key] = (this.component[key] as EventEmitter<
              any
            >).observers.length)
        );
    }
  }
  debugIsActive() {
    return (
      this._ngxBindIOConfig.debug ||
      (this.bindOutputs && this.bindOutputs.debug) ||
      (localStorage && localStorage.getItem('debug_ngx-bind-io') === 'true')
    ); // todo: remove on stable release
  }
}
