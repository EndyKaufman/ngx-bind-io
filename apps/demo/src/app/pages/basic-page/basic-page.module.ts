import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { BasicsModule } from '../../basics/basics.module';
import { DocsExampleModule } from '../../components/docs-example/docs-example.module';
import { SourceTabsModule } from '../../components/source-tabs/source-tabs.module';
import { UsersGridModule } from '../../entities/users/users-grid/users-grid.module';
import { SharedModule } from '../../shared/shared.module';
import { BasicPageComponent } from './basic-page.component';
import { BasicPageRoutes } from './basic-page.routes';

@NgModule({
  imports: [
    SharedModule,
    FlexLayoutModule,
    MarkdownModule.forRoot(),
    DocsExampleModule.forRoot(),
    RouterModule.forChild(BasicPageRoutes),
    SourceTabsModule,
    UsersGridModule,
    MatIconModule,
    BasicsModule
  ],
  entryComponents: [BasicPageComponent],
  exports: [BasicPageComponent],
  declarations: [BasicPageComponent]
})
export class BasicPageModule {}
