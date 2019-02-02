import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BindInputsDirective } from './directives/bind-inputs.directive';
import { BindIODirective } from './directives/bind-io.directive';
import { BindOutputsDirective } from './directives/bind-outputs.directive';
import { INgxBindIOConfig } from './interfaces/ngx-bind-io-config.interface';
import { defaultNgxBindIOConfig, NGX_BIND_IO_CONFIG } from './ngx-bind-io.config';
import { NgxBindInputsService } from './services/ngx-bind-inputs.service';
import { NgxBindIODebugService } from './services/ngx-bind-io-debug.service';
import { NgxBindIoService } from './services/ngx-bind-io.service';
import { NgxBindOutputsService } from './services/ngx-bind-outputs.service';

@NgModule({
  imports: [CommonModule],
  declarations: [BindInputsDirective, BindOutputsDirective, BindIODirective],
  exports: [BindInputsDirective, BindOutputsDirective, BindIODirective]
})
export class NgxBindIOModule {
  static forRoot(options?: INgxBindIOConfig): ModuleWithProviders {
    return {
      ngModule: NgxBindIOModule,
      providers: [
        {
          provide: NGX_BIND_IO_CONFIG,
          useValue: {
            debug: options ? options.debug : defaultNgxBindIOConfig.debug
          }
        },
        NgxBindIODebugService,
        NgxBindInputsService,
        NgxBindOutputsService,
        NgxBindIoService
      ]
    };
  }
}
