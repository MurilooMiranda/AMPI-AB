import { Component, Input, OnInit } from '@angular/core';
import merge from 'lodash/merge';
import { isNullOrUndefined } from 'src/app/util/functions';

import { ChartOptions } from './../chart-options';

@Component({
  selector: 'esm-bar-chart',
  templateUrl: './bar.component.html',
  styles: [],
})
export class BarComponent implements OnInit {
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
          stacked: true,
          type: 'bar',
          height: this.height,
          toolbar: {
            show: false,
          },
        },
        grid: {
          xaxis: {
            lines: {
              show: true,
            },
          },
        },
        yaxis: {
          axisTicks: {
            show: true,
          },
        },
        xaxis: {
          type: 'category',
          labels: {
            style: {
              fontSize: '10px',
            },
            trim: true,
          },
        },
        title: {
          align: 'center',
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: 0,
        },
      },
      this.customOptions
    );
  }
}
