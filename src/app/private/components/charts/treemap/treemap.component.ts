import { Component, Input, OnInit } from '@angular/core';
import merge from 'lodash/merge';
import { isNullOrUndefined } from 'src/app/util/functions';

import { ChartOptions } from '../chart-options';

@Component({
  selector: 'esm-treemap-chart',
  templateUrl: './treemap.component.html',
  styles: [],
})
export class TreeMapComponent implements OnInit {
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
          type: 'treemap',
          height: this.height,
          toolbar: {
            show: false,
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
