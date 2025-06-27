import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { ChartOptions } from 'src/app/private/components/charts/chart-options';
import { Result, SessionResult } from 'src/app/private/models/result.model';

@Component({
  selector: 'esm-user-result',
  templateUrl: './user-result.component.html',
  styleUrls: ['./user-result.component.scss'],
})
export class UserResultComponent implements OnInit {
  @Input() sessionResults: SessionResult[];
  chartByWeekDayOptions: ChartOptions;
  chartByMinutesOptions: ChartOptions;

  constructor() {}

  ngOnInit(): void {
    const weekdays = moment.weekdays();

    let weekdaysCounts = [];

    weekdays.forEach((wd, i) => {
      weekdaysCounts[wd] = 0;
    });

    this.sessionResults.forEach((result) => {
      weekdaysCounts[moment(result.started_at).format('dddd')] += 1;
    });

    this.chartByWeekDayOptions = {
      series: [
        {
          name: 'Quantidade',
          data: Object.keys(weekdaysCounts).map((weekday) => weekdaysCounts[weekday]),
        },
      ],
      xaxis: {
        categories: weekdays,
      },
    };

    let series = this.sessionResults.map((result) => moment.duration(this.getDuracaoMoment(result)).asSeconds());
    let seriesText = this.sessionResults.map((result) => this.getDuracao(result));
    let seriesFullText = this.sessionResults.map(
      (result) =>
        moment(result.started_at).format('DD/MM/YYYY à\\s hh:mm:ss') +
        ' até ' +
        moment(result.ended_at).format('hh:mm:ss') +
        '<br> Duração: ' +
        this.getDuracao(result)
    );

    this.chartByMinutesOptions = {
      series: series,
      labels: seriesFullText,
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return (
            '<div class="apexcharts-tooltip-y-group p-2">' +
            "<span class='apexcharts-tooltip-text-y-label'>" +
            w.globals.labels[seriesIndex] +
            '</span>' +
            '</div>'
          );
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return seriesText[opts.seriesIndex];
        },
      },
    };
  }

  getDuracao(result: Result | SessionResult): string {
    return this.getDuracaoMoment(result).format('mm:ss\\s');
  }

  getDuracaoMoment(result: Result | SessionResult): any {
    return moment(moment(result.ended_at).diff(result.started_at));
  }
}
