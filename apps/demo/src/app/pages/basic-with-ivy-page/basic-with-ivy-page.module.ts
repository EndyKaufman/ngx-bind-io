import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { WithIvyBasicsModule } from '../../basics-with-ivy/basics.module';
import { DocsExampleModule } from '../../components/docs-example/docs-example.module';
import { SourceTabsModule } from '../../components/source-tabs/source-tabs.module';
import { UsersGridModule } from '../../entities/users/users-grid/users-grid.module';
import { SharedModule } from '../../shared/shared.module';
import { BasicWithIvyPageComponent } from './basic-with-ivy-page.component';
import { BasicWithIvyPageRoutes } from './basic-with-ivy-page.routes';

@NgModule({
  imports: [
    SharedModule,
    FlexLayoutModule,
    MarkdownModule.forRoot(),
    DocsExampleModule.forRoot(),
    RouterModule.forChild(BasicWithIvyPageRoutes),
    SourceTabsModule,
    UsersGridModule,
    MatIconModule,
    WithIvyBasicsModule
  ],
  entryComponents: [BasicWithIvyPageComponent],
  exports: [BasicWithIvyPageComponent],
  declarations: [BasicWithIvyPageComponent]
})
export class BasicWithIvyPageModule {}
