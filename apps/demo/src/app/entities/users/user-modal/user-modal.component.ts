import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BindIoInner } from 'ngx-bind-io';
import { BaseModalComponent } from '../../../base/base-modal.component';
import { User } from '../../../models/user';
@BindIoInner()
@Component({
  selector: 'user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserModalComponent extends BaseModalComponent<User> {
  constructor(public dialogRef: MatDialogRef<BaseModalComponent<User>>, @Inject(MAT_DIALOG_DATA) public data?: any) {
    super(User, dialogRef, data);
  }
}
