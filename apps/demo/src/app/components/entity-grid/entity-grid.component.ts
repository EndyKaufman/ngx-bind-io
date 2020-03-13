import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BindObservable } from 'bind-observable';
import { BindIoInner } from 'ngx-bind-io';
import { Observable } from 'rxjs';

export class BaseEntityGridComponent<T = any> {
  @Input()
  dataSource: MatTableDataSource<T> = undefined;
  @Input()
  displayedColumns: string[] = undefined;
}
@BindIoInner()
@Component({
  selector: 'entity-grid',
  templateUrl: './entity-grid.component.html',
  styleUrls: ['./entity-grid.component.scss']
})
export class EntityGridComponent<T = any> extends BaseEntityGridComponent<T> implements OnChanges {
  @Input()
  class = 'entity-grid';
  @Input()
  strings: { [key: string]: string } = undefined;
  @Output()
  add = new EventEmitter<T>();
  @Output()
  edit = new EventEmitter<T>();
  @Output()
  delete = new EventEmitter<T>();
  @BindObservable()
  filtredDisplayedColumns: string[] = undefined;
  filtredDisplayedColumns$: Observable<string[]>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.displayedColumns) {
      this.filtredDisplayedColumns = changes.displayedColumns.currentValue.filter(column => column !== 'hidden');
    }
  }
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
