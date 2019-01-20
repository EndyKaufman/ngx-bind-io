import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PrismModule } from '@ngx-prism/core';
import { NgxBindIOModule, NgxBindOutputsService } from 'ngx-bind-io';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { MessageBoxModule } from './components/message-box/message-box.module';
import { NavbarModule } from './components/navbar/navbar.module';
import { SharedModule } from './shared/shared.module';
import { MyErrorStateMatcher } from './shared/utils/my-error-state-matcher';
import { MyNgxBindOutputsService } from './shared/utils/my-ngx-bind-outputs.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    PrismModule,
    SharedModule,
    MessageBoxModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'demo' }),
    NavbarModule,
    NgxBindIOModule.forRoot(),
    RouterModule.forRoot(AppRoutes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: MyErrorStateMatcher },
    { provide: NgxBindOutputsService, useClass: MyNgxBindOutputsService },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
