import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [
    SharedModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    FlexLayoutModule,
    MatMenuModule
  ],
  entryComponents: [NavbarComponent],
  exports: [NavbarComponent],
  declarations: [NavbarComponent]
})
export class NavbarModule {}
