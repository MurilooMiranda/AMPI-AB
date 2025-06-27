import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from '../components/components.module';
import { DAOService } from '../private/dao/dao.service';
import { ObserversService } from '../private/observers/observers.service';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { SecurityRoutingModule } from './security-routing.module';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, HeaderComponent],
  exports: [LoginComponent, SignupComponent, HeaderComponent],
  providers: [DAOService, ObserversService],
  imports: [CommonModule, SecurityRoutingModule, TranslateModule, ComponentsModule],
})
export class SecurityModule {}
