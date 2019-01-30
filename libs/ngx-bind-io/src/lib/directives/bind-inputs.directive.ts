import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
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
    private _ref: ChangeDetectorRef
  ) {}
  ngOnChanges(simpleChanges: SimpleChanges) {
    this.detectComponents();
  }
  ngAfterContentInit(): void {
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
    this._ref.markForCheck();
    if (typeof this.innerComponent['ngOnChanges'] === 'function') {
      const simpleChange = new SimpleChange(previousValue, value, this.innerSimpleChanges[innerKey] === undefined);
      this.innerComponent['ngOnChanges']({ [innerKey]: simpleChange });
      this.innerSimpleChanges[innerKey] = simpleChange;
    }
  }
  detectComponents() {
    if (!this.innerComponent && !this.hostComponent) {
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
      (this.bindInputs && this.bindInputs.debug) ||
      (localStorage && localStorage.getItem('debug_ngx-bind-io') === 'true')
    ); // todo: remove on stable release
  }
}
