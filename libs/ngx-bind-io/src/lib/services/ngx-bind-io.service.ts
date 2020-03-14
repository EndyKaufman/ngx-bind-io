import { ChangeDetectorRef, Inject, Injectable, SimpleChange, SimpleChanges, Injector } from '@angular/core';
import { BindIODirective } from '../directives/bind-io.directive';
import { INgxBindIOConfig } from '../interfaces/ngx-bind-io-config.interface';
import { NGX_BIND_IO_CONFIG } from '../ngx-bind-io.config';
import { NgxBindInputsService } from './ngx-bind-inputs.service';
import { NgxBindIODebugService } from './ngx-bind-io-debug.service';
import { NgxBindOutputsService } from './ngx-bind-outputs.service';
import { isFunction } from '../utils/utils';

@Injectable()
export class NgxBindIoService {
  constructor(
    @Inject(NGX_BIND_IO_CONFIG) private _ngxBindIOConfig: INgxBindIOConfig,
    private _ngxBindInputsService: NgxBindInputsService,
    private _ngxBindOutputsService: NgxBindOutputsService,
    private _ngxBindIODebugService: NgxBindIODebugService
  ) {}
  linkHostToInner(
    hostComponent: any,
    innerComponent: any,
    inputs?: { [key: string]: any },
    parentInjectorRef?: Injector,
    changeDetectorRef?: ChangeDetectorRef,
    config?: INgxBindIOConfig
  ) {
    const directive = new BindIODirective(
      undefined,
      config
        ? {
            ...this._ngxBindIOConfig,
            ...config
          }
        : this._ngxBindIOConfig,
      this._ngxBindInputsService,
      this._ngxBindOutputsService,
      this._ngxBindIODebugService,
      parentInjectorRef,
      changeDetectorRef
    );
    directive.ignoreKeysManualBinded = true;
    directive.hostComponent = hostComponent;
    directive.innerComponent = innerComponent;
    if (inputs) {
      const changes: SimpleChanges = {};
      Object.keys(inputs).forEach(innerKey => {
        directive.innerComponent[innerKey] = inputs[innerKey];
        changes[innerKey] = new SimpleChange(undefined, inputs[innerKey], true);
      });
      if (isFunction(directive.innerComponent.ngOnChanges)) {
        directive.innerComponent.ngOnChanges(changes);
      }
    }
    directive.bindAll();
  }
}
