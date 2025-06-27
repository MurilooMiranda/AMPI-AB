import { Component, Input, OnInit } from '@angular/core';
import merge from 'lodash/merge';
import { isNullOrUndefined } from 'src/app/util/functions';

import { ChartOptions } from '../chart-options';

@Component({
  selector: 'esm-pie-chart',
  templateUrl: './pie.component.html',
  styles: [],
})
export class PieComponent implements OnInit {
  @Input() customOptions: ChartOptions;
  @Input() height: number;
  @Input() title: string;

  chartOptions: ChartOptions;

  // eslint-disable-next-line max-lines-per-function
  ngOnInit(): void {
    if (isNullOrUndefined(this.height)) {
      this.height = 390;
    }

    this.chartOptions = merge(
      {
        chart: {
          type: 'pie',
          height: this.height,
          toolbar: {
            show: false,
          },
        },
        title: {
          align: 'center',
        },
        legend: {
          floating: true,
          offsetY: 0,
        },
      },
      this.customOptions
    );
  }
}
