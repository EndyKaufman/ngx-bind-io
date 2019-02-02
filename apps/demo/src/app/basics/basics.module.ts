import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxBindIOModule } from 'ngx-bind-io';
import {
  BasicBindInputNoOnPushComponent,
  BasicBindInputNoOnPushHostComponent
} from './bind-input-no-on-push.component';
import { BasicBindInputOnChangeComponent, BasicBindInputOnChangeHostComponent } from './bind-input-on-change.component';
import {
  BasicBindInputWithDeepInheritsModalComponent,
  BasicBindInputWithDeepInheritsModalHostComponent
} from './bind-input-with-deep-inherits-on-modal.component';
import {
  BasicBindInputWithDeepInheritsComponent,
  BasicBindInputWithDeepInheritsHostComponent
} from './bind-input-with-deep-inherits.component';
import {
  BasicBindInputWithExcludeComponent,
  BasicBindInputWithExcludeHostComponent
} from './bind-input-with-exclude.component';
import {
  BasicBindInputWithIncludeComponent,
  BasicBindInputWithIncludeHostComponent
} from './bind-input-with-include.component';
import { BasicBindInputComponent, BasicBindInputHostComponent } from './bind-input.component';
import { BasicBindIOWithManualComponent, BasicBindIOWithManualHostComponent } from './bind-io-with-manual.component';
import { BasicBindIOWithMixinsComponent, BasicBindIOWithMixinsHostComponent } from './bind-io-with-mixins.component';
import { BasicBindIOComponent, BasicBindIOHostComponent } from './bind-io.component';
import { BasicBindOneToManyComponent, BasicBindOneToManyHostComponent } from './bind-one-to-many.component';
import {
  BasicBindOutputWithClickComponent,
  BasicBindOutputWithClickHostComponent
} from './bind-output-with-click.component';
import {
  BasicBindOutputWithCustomClickComponent,
  BasicBindOutputWithCustomClickHostComponent
} from './bind-output-with-custom-click.component';
import { BasicBindOutputComponent, BasicBindOutputHostComponent } from './bind-output.component';

@NgModule({
  imports: [CommonModule, FormsModule, NgxBindIOModule, MatButtonModule],
  declarations: [
    BasicBindInputComponent,
    BasicBindInputHostComponent,
    BasicBindInputWithExcludeComponent,
    BasicBindInputWithExcludeHostComponent,
    BasicBindInputWithIncludeComponent,
    BasicBindInputWithIncludeHostComponent,
    BasicBindInputWithDeepInheritsComponent,
    BasicBindInputWithDeepInheritsHostComponent,
    BasicBindIOWithMixinsComponent,
    BasicBindIOWithMixinsHostComponent,
    BasicBindOutputComponent,
    BasicBindOutputHostComponent,
    BasicBindOutputWithClickHostComponent,
    BasicBindOutputWithClickComponent,
    BasicBindIOHostComponent,
    BasicBindIOComponent,
    BasicBindOutputWithCustomClickHostComponent,
    BasicBindOutputWithCustomClickComponent,
    BasicBindInputOnChangeHostComponent,
    BasicBindInputOnChangeComponent,
    BasicBindInputNoOnPushHostComponent,
    BasicBindInputNoOnPushComponent,
    BasicBindOneToManyHostComponent,
    BasicBindOneToManyComponent,
    BasicBindIOWithManualHostComponent,
    BasicBindIOWithManualComponent,
    BasicBindInputWithDeepInheritsModalComponent,
    BasicBindInputWithDeepInheritsModalHostComponent
  ],
  exports: [
    BasicBindInputHostComponent,
    BasicBindInputWithExcludeHostComponent,
    BasicBindInputWithIncludeHostComponent,
    BasicBindInputWithDeepInheritsHostComponent,
    BasicBindIOWithMixinsHostComponent,
    BasicBindOutputHostComponent,
    BasicBindOutputWithClickHostComponent,
    BasicBindIOHostComponent,
    BasicBindOutputWithCustomClickHostComponent,
    BasicBindInputOnChangeHostComponent,
    BasicBindInputNoOnPushHostComponent,
    BasicBindOneToManyHostComponent,
    BasicBindIOWithManualHostComponent,
    BasicBindInputWithDeepInheritsModalHostComponent
  ],
  entryComponents: [BasicBindInputWithDeepInheritsModalComponent]
})
export class BasicsModule {}
