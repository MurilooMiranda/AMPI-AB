import { Component, Input, OnInit } from '@angular/core';
import merge from 'lodash/merge';
import { isNullOrUndefined } from 'src/app/util/functions';

import { ChartOptions } from './../chart-options';

@Component({
  selector: 'esm-line-chart',
  templateUrl: './line.component.html',
  styles: [],
})
export class LineComponent implements OnInit {
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
          height: this.height,
          type: 'line',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'smooth',
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        title: {
          align: 'center',
        },
        yaxis: {
          forceNiceScale: true,
          floating: false,
          decimalsInFloat: 2,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
      },
      this.customOptions
    );
  }
}
