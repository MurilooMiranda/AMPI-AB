import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from 'src/app/security/permissions.guard';

import { ExternalApplicationAddComponent } from './add/add.component';
import { ExternalApplicationListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: 'list',
    component: ExternalApplicationListComponent,
    canActivate: [PermissionsGuard],
    data: {
      permissions: {
        only: ['EXTERNAL_APP_LIST'],
      },
    },
  },
  {
    path: 'add',
    component: ExternalApplicationAddComponent,
    canActivate: [PermissionsGuard],
    data: {
      permissions: {
        only: ['EXTERNAL_APP_ADD'],
      },
    },
  },
  {
    path: 'edit/:id',
    component: ExternalApplicationAddComponent,
    canActivate: [PermissionsGuard],
    data: {
      permissions: {
        only: ['EXTERNAL_APP_EDIT'],
      },
    },
  },
  { path: '**', redirectTo: '/private', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalApplicationRoutingModule {}
