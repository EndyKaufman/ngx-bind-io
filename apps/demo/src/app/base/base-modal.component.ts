import { EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DynamicFormBuilder, DynamicFormGroup } from 'ngx-dynamic-form-builder';
import { IFactoryModel, IModel } from 'ngx-repository';

export class BaseModalComponent<T extends IModel> {
  @Input()
  form: DynamicFormGroup<T> = undefined;
  @Input()
  hideOnNo = true;
  @Input()
  hideOnYes = false;
  @Input()
  strings: { [key: string]: string } = undefined;
  @Input()
  title: string = undefined;
  @Input()
  message: string = undefined;
  @Input()
  noTitle = 'Cancel';
  @Input()
  yesTitle = 'OK';
  @Output()
  no = new EventEmitter<BaseModalComponent<T>>();
  @Output()
  yes = new EventEmitter<BaseModalComponent<T>>();

  fb = new DynamicFormBuilder();

  constructor(
    public factoryModel: IFactoryModel<T>,
    public dialogRef: MatDialogRef<BaseModalComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    this.strings = this.factoryModel.strings;
    this.form = this.fb.group(this.factoryModel);
    if (this.data !== undefined) {
      this.form.object = this.data;
      this.form.validateAllFormFields();
    }
  }
  onYesClick(): void {
    if (this.data) {
      if (this.form.valid) {
        this.data = this.form.object;
        this.yes.emit(this);
      } else {
        this.form.validateAllFormFields();
      }
    } else {
      this.yes.emit(this);
    }
    if (this.hideOnYes) {
      this.dialogRef.close();
    }
  }
  onNoClick(): void {
    this.no.emit(this);
    if (this.hideOnNo) {
      this.dialogRef.close();
    }
  }
}
