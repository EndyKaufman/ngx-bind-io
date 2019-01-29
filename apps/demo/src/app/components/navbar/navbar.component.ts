import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { BindIoInner } from 'ngx-bind-io';
@BindIoInner()
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  @Input()
  title: string = undefined;
  @Input()
  set childrenRoutes(routes: any[]) {
    this._childrenRoutes = routes.filter((item: any) => item.data);
  }
  get childrenRoutes() {
    return this._childrenRoutes
      ? this._childrenRoutes
          .filter((item: any) => item.data && item.data.visible !== false && item.data.align !== 'left')
          .map((item: any) => {
            const newItem = item.data;
            newItem.url = `/${newItem.name}`;
            newItem.redirectTo = item.redirectTo;
            return newItem;
          })
      : [];
  }
  get leftChildrenRoutes() {
    return this._childrenRoutes
      ? this._childrenRoutes
          .filter((item: any) => item.data && item.data.visible !== false && item.data.align === 'left')
          .map((item: any) => {
            const newItem = item.data;
            newItem.url = `/${newItem.name}`;
            newItem.redirectTo = item.redirectTo;
            return newItem;
          })
      : [];
  }

  private _childrenRoutes: Routes;

  constructor(public router: Router) {}

  ngOnInit() {}
}
