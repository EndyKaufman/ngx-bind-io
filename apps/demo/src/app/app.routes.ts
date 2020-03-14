import { Routes } from '@angular/router';
import { BaseGridPageRoutes } from './pages/base-grid-page/base-grid-page.routes';
import { BasicPageRoutes } from './pages/basic-page/basic-page.routes';
import { CustomizationPageRoutes } from './pages/customization-page/customization-page.routes';
import { HomePageRoutes } from './pages/home-page/home-page.routes';
import { BasicWithIvyPageRoutes } from './pages/basic-with-ivy-page/basic-with-ivy-page.routes';

export const AppRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: './pages/home-page/home-page.module#HomePageModule',
    data: HomePageRoutes[0].data
  },
  {
    path: BasicWithIvyPageRoutes[0].data.name,
    loadChildren: './pages/basic-with-ivy-page/basic-with-ivy-page.module#BasicWithIvyPageModule',
    data: BasicWithIvyPageRoutes[0].data
  },
  {
    path: BasicPageRoutes[0].data.name,
    loadChildren: './pages/basic-page/basic-page.module#BasicPageModule',
    data: BasicPageRoutes[0].data
  },
  {
    path: 'base-grid',
    loadChildren: './pages/base-grid-page/base-grid-page.module#BaseGridPageModule',
    data: BaseGridPageRoutes[0].data
  },
  {
    path: 'customization',
    loadChildren: './pages/customization-page/customization-page.module#CustomizationPageModule',
    data: CustomizationPageRoutes[0].data
  },
  {
    path: 'github',
    redirectTo: 'https://github.com/EndyKaufman/ngx-bind-io',
    data: {
      name: 'github',
      title: 'github',
      svgIcon: `github-circle`,
      visible: true
    }
  } /*,
  {
    path: '**',
    redirectTo: 'home'
  }*/
];
