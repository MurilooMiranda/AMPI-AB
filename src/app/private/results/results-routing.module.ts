import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ShowComponent } from './show/show.component';
import { DashboardResultsComponent } from './dashboard/dashboard.component';
import { PatientsComponent } from './patients/patients.component';
import { ReassessmentsComponent } from './reassessments/reassessments.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
  },
  {
    path: 'show/:id',
    component: ShowComponent,
  },
  {
    path: 'show/graphs/:id',
    component: ShowComponent,
  },
  {
    path: 'dashboard',
    component: DashboardResultsComponent,
  },
  {
    path: 'patients',
    component: PatientsComponent
  },
  {
    path: 'reassessments',
    component: ReassessmentsComponent
  },
  {
   path: '**', redirectTo: '/private', pathMatch: 'full'

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
