import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParticipanstAddComponent } from './add/participantsadd.component';
import { ParticipantsListComponent } from './list/participantslist.component';

const routes: Routes = [
  {
    path: 'list',
    component: ParticipantsListComponent,
  },
  { path: 'add', component: ParticipanstAddComponent },
  { path: 'edit/:id', component: ParticipanstAddComponent },
  { path: '**', redirectTo: '/private', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParticipantsRoutingModule {}
