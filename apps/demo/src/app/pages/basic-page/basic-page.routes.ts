import { Routes } from '@angular/router';
import { BasicPageComponent } from './basic-page.component';

export const BasicPageRoutes: Routes = [
  {
    path: '',
    component: BasicPageComponent,
    data: {
      name: 'basic',
      title: 'Basic',
      visible: true
    },
    children: []
  }
];
