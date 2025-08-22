import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from 'src/app/security/permissions.guard';

import { LevelsAddComponent } from './add/add.component';
import { LevelListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [PermissionsGuard],
    data: {
      permissions: {
        only: ['LEVELS_LIST'],
      },
    },
    component: LevelListComponent,
  },
  {
    path: 'add',
    canActivate: [PermissionsGuard],
    data: {
      permissions: {
        only: ['LEVELS_ADD'],
      },
    },
    component: LevelsAddComponent,
  },
  {
    path: 'edit/:id',
    canActivate: [PermissionsGuard],
    data: {
      permissions: {
        only: ['LEVELS_EDIT'],
      },
    },
    component: LevelsAddComponent,
  },
  { path: '**', redirectTo: '/private', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LevelsRoutingModule {}
