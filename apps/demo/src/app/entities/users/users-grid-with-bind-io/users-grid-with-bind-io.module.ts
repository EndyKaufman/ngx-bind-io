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
import { UsersGridWithBindIOComponent } from './users-grid-with-bind-io.component';
import { NgxBindIOModule } from 'ngx-bind-io';

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
    MessageBoxModule,
    NgxBindIOModule
  ],
  entryComponents: [UsersGridWithBindIOComponent],
  exports: [UsersGridWithBindIOComponent],
  declarations: [UsersGridWithBindIOComponent]
})
export class UsersGridWithBindIOModule {}
