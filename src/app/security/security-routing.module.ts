import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from './loggedin.guard';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: 'signup',
    children: [{ path: '', component: SignupComponent }],
    canActivate: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {}
