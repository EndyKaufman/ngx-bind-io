import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SourceTabsModule } from '../../components/source-tabs/source-tabs.module';
import { UsersGridWithBindIOModule } from '../../entities/users/users-grid-with-bind-io/users-grid-with-bind-io.module';
import { UsersGridModule } from '../../entities/users/users-grid/users-grid.module';
import { SharedModule } from '../../shared/shared.module';
import { BaseGridPageComponent } from './base-grid-page.component';
import { BaseGridPageRoutes } from './base-grid-page.routes';
import { DocsExampleModule } from '../../components/docs-example/docs-example.module';

@NgModule({
  imports: [
    SharedModule,
    FlexLayoutModule,
    DocsExampleModule.forRoot(),
    RouterModule.forChild(BaseGridPageRoutes),
    SourceTabsModule,
    UsersGridModule,
    UsersGridWithBindIOModule,
    MatIconModule
  ],
  entryComponents: [BaseGridPageComponent],
  exports: [BaseGridPageComponent],
  declarations: [BaseGridPageComponent]
})
export class BaseGridPageModule {}
