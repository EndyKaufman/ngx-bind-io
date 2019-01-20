import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BindInputsDirective } from './directives/bind-inputs.directive';
import { BindIODirective } from './directives/bind-io.directive';
import { BindOutputsDirective } from './directives/bind-outputs.directive';
import { NgxBindInputsService } from './services/ngx-bind-inputs.service';
import { NgxBindOutputsService } from './services/ngx-bind-outputs.service';

@NgModule({
  imports: [CommonModule],
  declarations: [BindInputsDirective, BindOutputsDirective, BindIODirective],
  exports: [BindInputsDirective, BindOutputsDirective, BindIODirective]
})
export class NgxBindIOModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxBindIOModule,
      providers: [NgxBindInputsService, NgxBindOutputsService]
    };
  }
}
