import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { BindIoInner } from 'ngx-bind-io';
@BindIoInner()
@Component({
  selector: 'message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageBoxComponent implements OnInit {
  @Input()
  isInfo?: boolean = undefined;
  @Input()
  isError?: boolean = undefined;
  @Input()
  hideOnNo = true;
  @Input()
  hideOnYes = false;
  @Input()
  title: string = undefined;
  @Input()
  message: string = undefined;
  @Input()
  noTitle = 'Cancel';
  @Input()
  yesTitle = 'OK';
  @Output()
  no = new EventEmitter<MessageBoxComponent>();
  @Output()
  yes = new EventEmitter<MessageBoxComponent>();

  constructor(public dialogRef: MatDialogRef<MessageBoxComponent>, public changeDetectorRef: ChangeDetectorRef) {}
  ngOnInit() {
    this.changeDetectorRef.detectChanges();
  }
  onYesClick() {
    this.yes.emit(this);
    if (this.hideOnYes) {
      this.dialogRef.close();
    }
  }
  onNoClick() {
    this.no.emit(this);
    if (this.hideOnNo) {
      this.dialogRef.close();
    }
  }
}
