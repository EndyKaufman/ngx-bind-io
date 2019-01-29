import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { BindIoInner } from 'ngx-bind-io';

@BindIoInner()
@Component({
  selector: 'entity-grid',
  templateUrl: './entity-grid.component.html',
  styleUrls: ['./entity-grid.component.scss']
})
export class EntityGridComponent<T = any> {
  @Input()
  class = 'entity-grid';
  @Input()
  dataSource: MatTableDataSource<T> = undefined;
  @Input()
  displayedColumns: string[] = undefined;
  @Input()
  strings: { [key: string]: string } = undefined;
  @Output()
  add = new EventEmitter<T>();
  @Output()
  edit = new EventEmitter<T>();
  @Output()
  delete = new EventEmitter<T>();

  onAddClick(item?: T) {
    this.add.next(item);
  }
  onEditClick(item?: T): void {
    this.edit.next(item);
  }
  onDeleteClick(item: T): void {
    this.delete.next(item);
  }
}
