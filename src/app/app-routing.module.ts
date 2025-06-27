import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from './security/loggedin.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./index/index.module').then((m) => m.IndexModule),
  },
  {
    path: 'security',
    loadChildren: () => import('./security/security.module').then((m) => m.SecurityModule),
    canLoad: [LoggedInGuard],
  },
  {
    path: 'private',
    loadChildren: () => import('./private/private.module').then((m) => m.PrivateModule),
    canLoad: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
