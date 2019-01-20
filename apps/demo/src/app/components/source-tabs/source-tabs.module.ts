import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { PrismModule } from '@ngx-prism/core';
import { SharedModule } from '../../shared/shared.module';
import { SourceTabsComponent } from './source-tabs.component';

@NgModule({
  imports: [SharedModule, PrismModule, MatTabsModule, MatIconModule, MatButtonModule, FlexLayoutModule],
  entryComponents: [SourceTabsComponent],
  exports: [SourceTabsComponent],
  declarations: [SourceTabsComponent]
})
export class SourceTabsModule {}
