import { Routes } from '@angular/router';
import { BaseGridPageComponent } from './base-grid-page.component';

export const BaseGridPageRoutes: Routes = [
  {
    path: '',
    component: BaseGridPageComponent,
    data: {
      name: 'base-grid',
      title: 'Base grid',
      visible: true
    },
    children: []
  }
];
