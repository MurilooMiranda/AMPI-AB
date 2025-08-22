import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProgramsAddComponent } from './add/programsadd.component';
import { Step1Component } from './add/step1/step1.component';
import { Step2Component } from './add/step2/step2.component';
import { Step3Component } from './add/step3/step3.component';
import { Step4Component } from './add/step4/step4.component';
import { ProgramsListComponent } from './list/programslist.component';

const routes: Routes = [
  {
    path: 'list',
    component: ProgramsListComponent,
  },
  {
    path: 'add',
    component: ProgramsAddComponent,
    children: [
      { path: '', redirectTo: 'first', pathMatch: 'prefix' },
      { path: 'first', component: Step1Component },
      { path: 'second', component: Step2Component },
      { path: 'third', component: Step3Component },
      { path: 'fourth', component: Step4Component },
    ],
  },
  {
    path: 'edit/:id',
    component: ProgramsAddComponent,
    children: [
      { path: '', redirectTo: 'first', pathMatch: 'prefix' },
      { path: 'first', component: Step1Component },
      { path: 'second', component: Step2Component },
      { path: 'third', component: Step3Component },
      { path: 'fourth', component: Step4Component },
    ],
  },
  { path: '**', redirectTo: '/private', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramsRoutingModule {}
