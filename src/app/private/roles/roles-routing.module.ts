import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from 'src/app/security/permissions.guard';

import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [PermissionsGuard],
    data: {
      permissions: {
        only: ['ROLES_LIST'],
      },
    },
    component: ListComponent,
  },
  {
    path: 'add',
    canActivate: [PermissionsGuard],
    data: {
      permissions: {
        only: ['ROLES_ADD'],
      },
    },
    component: AddComponent,
  },
  {
    path: 'edit/:id',
    canActivate: [PermissionsGuard],
    data: {
      permissions: {
        only: ['ROLES_EDIT'],
      },
    },
    component: AddComponent,
  },
  { path: '**', redirectTo: '/private', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
