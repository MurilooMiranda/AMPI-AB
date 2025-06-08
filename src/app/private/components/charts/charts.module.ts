import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

import { BarComponent } from './bar/bar.component';
import { LineComponent } from './line/line.component';
import { PieComponent } from './pie/pie.component';
import { StackedBarComponent } from './stacked-bar/stacked-bar.component';
import { TreeMapComponent } from './treemap/treemap.component';

const COMPONENTS = [BarComponent, LineComponent, StackedBarComponent, TreeMapComponent, PieComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, NgApexchartsModule],
  exports: [...COMPONENTS, NgApexchartsModule],
})
export class ChartsModule {}
