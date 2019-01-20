import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { MessageBoxComponent } from './message-box.component';
import { MessageBoxService } from './message-box.service';

@NgModule({
  imports: [SharedModule, MatDialogModule, MatButtonModule, MatInputModule, FlexLayoutModule],
  providers: [MessageBoxService],
  entryComponents: [MessageBoxComponent],
  exports: [MessageBoxComponent],
  declarations: [MessageBoxComponent]
})
export class MessageBoxModule {}
