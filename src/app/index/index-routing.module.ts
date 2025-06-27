import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DownloadComponent } from './download/download.component';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index.component';
import { TeamComponent } from './team/team.component';
import { TimelineComponent } from './timeline/timeline.component';
import { WorksComponent } from './works/works.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'works',
        component: WorksComponent,
      },
      {
        path: 'download',
        component: DownloadComponent,
      },
      {
        path: 'timeline',
        component: TimelineComponent,
      },
      {
        path: 'team',
        component: TeamComponent,
      },
      {
        path: 'documentation',
        component: WorksComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexRoutingModule {}
