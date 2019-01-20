import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatTableModule
} from '@angular/material';
import { NgxRepositoryModule } from 'ngx-repository';
import { EntityGridModule } from '../../../components/entity-grid/entity-grid.module';
import { MessageBoxModule } from '../../../components/message-box/message-box.module';
import { SharedModule } from '../../../shared/shared.module';
import { UserModalModule } from '../user-modal/user-modal.module';
import { UsersGridComponent } from './users-grid.component';

@NgModule({
  imports: [
    SharedModule,
    NgxRepositoryModule,
    EntityGridModule,
    NgxRepositoryModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    UserModalModule,
    MessageBoxModule
  ],
  entryComponents: [UsersGridComponent],
  exports: [UsersGridComponent],
  declarations: [UsersGridComponent]
})
export class UsersGridModule {}
