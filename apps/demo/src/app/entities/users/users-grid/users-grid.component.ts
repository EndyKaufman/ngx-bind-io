import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DynamicRepository } from 'ngx-repository';
import { BaseGridComponent } from '../../../base/base-grid.component';
import { MessageBoxService } from '../../../components/message-box/message-box.service';
import { User } from '../../../models/user';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  selector: 'users-grid',
  templateUrl: './users-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersGridComponent extends BaseGridComponent<User> {
  @Input()
  itemModalOptions = {
    component: UserModalComponent
  };
  strings = User.strings;

  constructor(
    public dialog: MatDialog,
    public dynamicRepository: DynamicRepository,
    public messageBoxService: MessageBoxService
  ) {
    super(User, dialog, dynamicRepository, messageBoxService);
  }
}
