import { Routes } from '@angular/router';
import { BasicWithIvyPageComponent } from './basic-with-ivy-page.component';

export const BasicWithIvyPageRoutes: Routes = [
  {
    path: '',
    component: BasicWithIvyPageComponent,
    data: {
      name: 'basic-ivy',
      title: 'Basic',
      visible: true
    },
    children: []
  }
];
