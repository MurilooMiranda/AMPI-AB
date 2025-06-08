import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ComponentsModule } from 'src/app/components/components.module';

import { SharedModule } from '../../app.shared.module';
import { ChartsModule } from '../components/charts/charts.module';
import { ListComponent } from './list/list.component';
import { UsersRoutingModule } from './results-routing.module';
import {
  UserResultTableRowComponent,
} from './show/event-result/components/user-result-table-row/user-result-table-row.component';
import { EventResultComponent } from './show/event-result/event-result.component';
import { OverviewResultComponent } from './show/event-result/overview-result/overview-result.component';
import { UserResultComponent } from './show/event-result/user-result/user-result.component';
import { ShowComponent } from './show/show.component';

// imports from dependencies

@NgModule({
  imports: [SharedModule, ComponentsModule, UsersRoutingModule, CommonModule, TooltipModule.forRoot(), NgApexchartsModule, ChartsModule],
  exports: [SharedModule],
  declarations: [
    ShowComponent,
    ListComponent,
    EventResultComponent,
    OverviewResultComponent,
    UserResultComponent,
    UserResultTableRowComponent,
  ],
})
export class ResultsModule {}
