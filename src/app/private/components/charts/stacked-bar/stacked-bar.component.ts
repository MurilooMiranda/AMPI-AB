import { Component, Input, OnInit } from '@angular/core';
import merge from 'lodash/merge';
import { isNullOrUndefined } from 'src/app/util/functions';

import { ChartOptions } from './../chart-options';

@Component({
  selector: 'esm-stacked-bar-chart',
  templateUrl: './stacked-bar.component.html',
  styles: [],
})
export class StackedBarComponent implements OnInit {
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
          type: 'bar',
          width: '100%',
          height: this.height,
          stacked: true,
          stackType: '100%',
          zoom: {
            enabled: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        title: {
          align: 'center',
        },
        stroke: {
          width: 1,
          colors: ['#fff'],
        },
        fill: {
          opacity: 1,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40,
        },
      },
      this.customOptions
    );
  }
}
