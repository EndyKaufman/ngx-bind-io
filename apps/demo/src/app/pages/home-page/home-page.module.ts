import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { SourceTabsModule } from '../../components/source-tabs/source-tabs.module';
import { SharedModule } from '../../shared/shared.module';
import { HomePageComponent } from './home-page.component';
import { HomePageRoutes } from './home-page.routes';
import { DocsExampleModule } from '../../components/docs-example/docs-example.module';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(HomePageRoutes),
    MarkdownModule.forRoot(),
    DocsExampleModule.forRoot(),
    SourceTabsModule,
    FlexLayoutModule
  ],
  declarations: [HomePageComponent]
})
export class HomePageModule {}
