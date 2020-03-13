import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BindIoInner } from 'ngx-bind-io';
import { DynamicRepository } from 'ngx-repository';
import { BaseGridComponent } from '../../../base/base-grid.component';
import { MessageBoxService } from '../../../components/message-box/message-box.service';
import { User } from '../../../models/user';
import { UserModalComponent } from '../user-modal/user-modal.component';
@BindIoInner()
@Component({
  selector: 'users-grid-with-bind-io',
  templateUrl: './users-grid-with-bind-io.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersGridWithBindIOComponent extends BaseGridComponent<User> {
  @Input()
  itemModalOptions = {
    component: UserModalComponent
  };
  @Input()
  strings = User.strings;
  @Input()
  displayedColumns = ['id', 'username', 'email', 'roles', 'action', 'hidden'];

  constructor(
    public dialog: MatDialog,
    public dynamicRepository: DynamicRepository,
    public messageBoxService: MessageBoxService
  ) {
    super(User, dialog, dynamicRepository, messageBoxService);
  }
  onAdd(item?: User): void {
    alert('Example empty "onAdd" method, not binded, because exists "onAddClick"');
  }
}
