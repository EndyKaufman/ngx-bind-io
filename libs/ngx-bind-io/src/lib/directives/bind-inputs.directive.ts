import {
  AfterContentInit,
  ApplicationRef,
  ChangeDetectorRef,
  Directive,
  EmbeddedViewRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChange,
  SimpleChanges,
  SkipSelf,
  ViewContainerRef,
  Injector
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
export class BindInputsDirective implements Partial<INgxBindIODirective>, OnChanges, AfterContentInit, OnDestroy {
  @Input()
  bindInputs: INgxBindIOConfig | undefined;
  @Input()
  excludeInputs: string[] | string = [];
  @Input()
  includeInputs: string[] | string = [];

  innerComponent: any;
  hostComponent: any;
  inputs: {
    innerKeys: string[];
    hostKeys: string[];
  };

  usedInputs: { [key: string]: string } = {};
  destroyed$: Subject<boolean> = new Subject<boolean>();
  innerSimpleChanges: SimpleChanges = {};

  constructor(
    public viewContainerRef: ViewContainerRef,
    @Inject(NGX_BIND_IO_CONFIG) private _ngxBindIOConfig: INgxBindIOConfig,
    private _ngxBindInputsService: NgxBindInputsService,
    private _ngxBindIODebugService: NgxBindIODebugService,
    @SkipSelf()
    private _parentInjector: Injector,
    private _detectorRef: ChangeDetectorRef
  ) {}
  ngOnChanges(simpleChanges: SimpleChanges) {
    this.detectComponents();
  }
  ngAfterContentInit() {
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
  bindValue(innerKey: string, value: any) {
    const previousValue = this.innerComponent[innerKey];
    this.innerComponent[innerKey] = value;
    if (this._detectorRef && typeof this._detectorRef.markForCheck === 'function') {
      this._detectorRef.markForCheck();
    }
    if (this._detectorRef instanceof ApplicationRef) {
      setTimeout(() => ((this._detectorRef as any) as ApplicationRef).tick(), 50);
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
  detectComponents() {
    if (this.viewContainerRef && !this.innerComponent && !this.hostComponent) {
      // ivy
      this.innerComponent = (this._detectorRef as EmbeddedViewRef<any>)?.context;
      this.hostComponent =
        this._parentInjector &&
        ((this._parentInjector as any)?._lView || []).filter(item => item && item.__ngContext__)[1];
      // if not ivy try old logic
      if (!this.innerComponent) {
        this.innerComponent = this.viewContainerRef['_data'].componentView.component;
      }
      // if not ivy try old logic
      if (!this.hostComponent) {
        this.hostComponent = (<any>this.viewContainerRef)._view.context;
        if (this.hostComponent.$implicit !== undefined) {
          this.hostComponent = (<any>this.viewContainerRef)._view.component;
        }
      }
    }
  }
  debugIsActive() {
    return this._ngxBindIOConfig.debug || (this.bindInputs && this.bindInputs.debug);
  }
}
