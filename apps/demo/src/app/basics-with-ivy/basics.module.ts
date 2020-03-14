import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxBindIOModule } from 'ngx-bind-io';
import {
  WithIvyBasicBindInputNoOnPushComponent,
  WithIvyBasicBindInputNoOnPushHostComponent
} from './bind-input-no-on-push.component';
import {
  WithIvyBasicBindInputOnChangeComponent,
  WithIvyBasicBindInputOnChangeHostComponent
} from './bind-input-on-change.component';
import {
  WithIvyBasicBindInputWithDeepInheritsModalComponent,
  WithIvyBasicBindInputWithDeepInheritsModalHostComponent
} from './bind-input-with-deep-inherits-on-modal.component';
import {
  WithIvyBasicBindInputWithDeepInheritsComponent,
  WithIvyBasicBindInputWithDeepInheritsHostComponent
} from './bind-input-with-deep-inherits.component';
import {
  WithIvyBasicBindInputWithExcludeComponent,
  WithIvyBasicBindInputWithExcludeHostComponent
} from './bind-input-with-exclude.component';
import {
  WithIvyBasicBindInputWithIncludeComponent,
  WithIvyBasicBindInputWithIncludeHostComponent
} from './bind-input-with-include.component';
import { WithIvyBasicBindInputComponent, WithIvyBasicBindInputHostComponent } from './bind-input.component';
import {
  WithIvyBasicBindIOWithManualComponent,
  WithIvyBasicBindIOWithManualHostComponent
} from './bind-io-with-manual.component';
import {
  WithIvyBasicBindIOWithMixinsComponent,
  WithIvyBasicBindIOWithMixinsHostComponent
} from './bind-io-with-mixins.component';
import { WithIvyBasicBindIOComponent, WithIvyBasicBindIOHostComponent } from './bind-io.component';
import {
  WithIvyBasicBindOneToManyComponent,
  WithIvyBasicBindOneToManyHostComponent
} from './bind-one-to-many.component';
import {
  WithIvyBasicBindOutputWithClickComponent,
  WithIvyBasicBindOutputWithClickHostComponent
} from './bind-output-with-click.component';
import {
  WithIvyBasicBindOutputWithCustomClickComponent,
  WithIvyBasicBindOutputWithCustomClickHostComponent
} from './bind-output-with-custom-click.component';
import { WithIvyBasicBindOutputComponent, WithIvyBasicBindOutputHostComponent } from './bind-output.component';

@NgModule({
  imports: [CommonModule, FormsModule, NgxBindIOModule, MatButtonModule],
  declarations: [
    WithIvyBasicBindInputComponent,
    WithIvyBasicBindInputHostComponent,
    WithIvyBasicBindInputWithExcludeComponent,
    WithIvyBasicBindInputWithExcludeHostComponent,
    WithIvyBasicBindInputWithIncludeComponent,
    WithIvyBasicBindInputWithIncludeHostComponent,
    WithIvyBasicBindInputWithDeepInheritsComponent,
    WithIvyBasicBindInputWithDeepInheritsHostComponent,
    WithIvyBasicBindIOWithMixinsComponent,
    WithIvyBasicBindIOWithMixinsHostComponent,
    WithIvyBasicBindOutputComponent,
    WithIvyBasicBindOutputHostComponent,
    WithIvyBasicBindOutputWithClickHostComponent,
    WithIvyBasicBindOutputWithClickComponent,
    WithIvyBasicBindIOHostComponent,
    WithIvyBasicBindIOComponent,
    WithIvyBasicBindOutputWithCustomClickHostComponent,
    WithIvyBasicBindOutputWithCustomClickComponent,
    WithIvyBasicBindInputOnChangeHostComponent,
    WithIvyBasicBindInputOnChangeComponent,
    WithIvyBasicBindInputNoOnPushHostComponent,
    WithIvyBasicBindInputNoOnPushComponent,
    WithIvyBasicBindOneToManyHostComponent,
    WithIvyBasicBindOneToManyComponent,
    WithIvyBasicBindIOWithManualHostComponent,
    WithIvyBasicBindIOWithManualComponent,
    WithIvyBasicBindInputWithDeepInheritsModalComponent,
    WithIvyBasicBindInputWithDeepInheritsModalHostComponent
  ],
  exports: [
    WithIvyBasicBindInputHostComponent,
    WithIvyBasicBindInputWithExcludeHostComponent,
    WithIvyBasicBindInputWithIncludeHostComponent,
    WithIvyBasicBindInputWithDeepInheritsHostComponent,
    WithIvyBasicBindIOWithMixinsHostComponent,
    WithIvyBasicBindOutputHostComponent,
    WithIvyBasicBindOutputWithClickHostComponent,
    WithIvyBasicBindIOHostComponent,
    WithIvyBasicBindOutputWithCustomClickHostComponent,
    WithIvyBasicBindInputOnChangeHostComponent,
    WithIvyBasicBindInputNoOnPushHostComponent,
    WithIvyBasicBindOneToManyHostComponent,
    WithIvyBasicBindIOWithManualHostComponent,
    WithIvyBasicBindInputWithDeepInheritsModalHostComponent
  ],
  entryComponents: [WithIvyBasicBindInputWithDeepInheritsModalComponent]
})
export class WithIvyBasicsModule {}
