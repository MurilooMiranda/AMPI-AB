import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateComponent } from './private.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoggedInGuard } from '../security/loggedin.guard';



const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    //canActivate: [LoggedInGuard],
    children: [
      { path: '', component: DashboardComponent },
      {
        path: 'participants',
        loadChildren: () => import('./participants/participants.module').then((m) => m.ParticipantModule),
      },
      {
        path: 'programs',
        loadChildren: () => import('./programs/programs.module').then((m) => m.ProgramsModule),
      },
      {
        path: 'external-applications',
        loadChildren: () => import('./external-applications/external-applications.module').then((m) => m.ExternalApplicationsModule),
      },

      {
        path: 'levels',
        loadChildren: () => import('./levels/levels.module').then((m) => m.LevelsModule),
      },

      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
      },

      {
        path: 'results',
        loadChildren: () => import('./results/results.module').then((m) => m.ResultsModule),
      },
      {
        path: 'roles',
        loadChildren: () => import('./roles/roles.module').then((m) => m.RolesModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule { }


