import { ComponentType } from '@angular/cdk/portal';
import { AfterContentInit, Input } from '@angular/core';
import { ValidationError } from 'class-validator';
import { ShortValidationErrors } from 'ngx-dynamic-form-builder';
import { DynamicRepository, IFactoryModel, IModel, Repository, ValidatorError } from 'ngx-repository';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageBoxService } from '../components/message-box/message-box.service';
import { BaseModalComponent } from './base-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export class BaseGridComponent<T extends IModel> implements AfterContentInit {
  @Input()
  itemModalOptions: {
    component?: BaseModalComponent<T> | any;
    title?: string;
  } = {
    title: 'Item'
  };
  @Input()
  addModalOptions: {
    component?: BaseModalComponent<T> | any;
    title?: string;
  } = {
    title: 'Create item'
  };
  @Input()
  editModalOptions: {
    component?: BaseModalComponent<T> | any;
    title?: string;
  } = {
    title: 'Edit item #{data.id}'
  };
  @Input()
  deleteModalOptions: {
    component?: BaseModalComponent<T> | any;
    title?: string;
    message?: string;
  } = {
    title: 'Delete item #{data.id}',
    message: 'Are you sure to delete?'
  };
  @Input()
  mockedItems?: T[];
  @Input()
  apiUrl?: string;
  @Input()
  strings: { [key: string]: string };
  @Input()
  displayedColumns: string[];

  dataSource$: Observable<MatTableDataSource<T>>;
  repository: Repository<T>;

  constructor(
    public factoryModel: IFactoryModel<T>,
    public dialog: MatDialog,
    public dynamicRepository: DynamicRepository,
    public messageBoxService: MessageBoxService
  ) {
    this.repository = this.dynamicRepository.fork<T>(this.factoryModel);
  }
  ngAfterContentInit() {
    if (this.mockedItems === undefined) {
      this.repository.useRest({
        ...{
          apiUrl: this.apiUrl,
          pluralName: 'users',
          paginationMeta: {
            perPage: 10000
          }
        }
      });
    }
    if (this.mockedItems !== undefined) {
      this.repository.useMock({
        ...{
          items: this.mockedItems,
          paginationMeta: {
            perPage: 10000
          }
        }
      });
    }
    this.dataSource$ = this.repository.items$.pipe(map(items => new MatTableDataSource<T>(items)));
  }
  onEdit(item: T): void {
    alert('Example empty "onEdit" method, not binded, because exists "onEditClick"');
  }
  onDelete(item: T): void {
    alert('Example empty "onDelete" method, not binded, because exists "onDeleteClick"');
  }
  onAddClick(item?: T): void {
    this.showItemModal(
      this.addModalOptions && this.addModalOptions.component,
      this.addModalOptions && this.addModalOptions.title
    );
  }
  onEditClick(item: T): void {
    this.showItemModal(
      this.editModalOptions && this.editModalOptions.component,
      this.editModalOptions && this.editModalOptions.title,
      item
    );
  }
  onDeleteClick(item: T): void {
    const component =
      (this.deleteModalOptions && this.deleteModalOptions.component) ||
      (this.itemModalOptions && this.itemModalOptions.component) ||
      '';
    const title =
      (this.deleteModalOptions && this.deleteModalOptions.title) ||
      (this.itemModalOptions && this.itemModalOptions.title) ||
      '';
    const message = (this.deleteModalOptions && this.deleteModalOptions.message) || '';
    const dialogRef = this.dialog.open((component as any) as ComponentType<BaseModalComponent<T>>, {
      width: '300px'
    });
    dialogRef.componentInstance.title = title.replace('{data.id}', (item.id || '').toString());
    dialogRef.componentInstance.message = message.replace('{data.id}', (item.id || '').toString());
    dialogRef.componentInstance.yes.subscribe((modal: BaseModalComponent<T>) =>
      this.repository.delete(item.id).subscribe(
        modalItem => {
          dialogRef.close();
        },
        error => this.messageBoxService.error(error).then()
      )
    );
  }
  showItemModal(component: BaseModalComponent<T>, title: string, item?: T): void {
    if (item === undefined) {
      item = new this.factoryModel();
    }
    component = component || (this.itemModalOptions && this.itemModalOptions.component);
    title = title || (this.itemModalOptions && this.itemModalOptions.title) || '';
    const dialogRef = this.dialog.open((component as any) as ComponentType<BaseModalComponent<T>>, {
      width: '500px',
      data: item
    });
    dialogRef.componentInstance.title = title.replace('{data.id}', (item.id || '').toString());
    dialogRef.componentInstance.yes.subscribe((modal: BaseModalComponent<T>) =>
      this.repository.save(modal.data).subscribe(
        modalItem => {
          if (modal.data !== undefined) {
            dialogRef.close();
          }
        },
        error => {
          if (error instanceof ValidatorError) {
            const externalErrors: ShortValidationErrors = {};
            (error.errors as ValidationError[]).map(err => {
              Object.keys(err.constraints).forEach(cons => {
                externalErrors[cons] = ['custom error:' + err.constraints[cons]];
              });
              return err;
            });
            modal.form.validate(externalErrors);
            modal.form.validateAllFormFields();
          } else {
            this.messageBoxService.error(error).then();
          }
        }
      )
    );
  }
}
