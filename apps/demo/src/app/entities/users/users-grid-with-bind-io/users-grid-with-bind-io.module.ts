import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxBindIOModule } from 'ngx-bind-io';
import { NgxRepositoryModule } from 'ngx-repository';
import { EntityGridModule } from '../../../components/entity-grid/entity-grid.module';
import { MessageBoxModule } from '../../../components/message-box/message-box.module';
import { SharedModule } from '../../../shared/shared.module';
import { UserModalModule } from '../user-modal/user-modal.module';
import { UsersGridWithBindIOComponent } from './users-grid-with-bind-io.component';

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
