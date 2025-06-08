import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import countBy from 'lodash/countBy';
import moment from 'moment';
import { ChartOptions } from 'src/app/private/components/charts/chart-options';
import { SessionResult } from 'src/app/private/models/result.model';
import { User } from 'src/app/private/models/user.model';

@Component({
  selector: 'esm-overview-result',
  templateUrl: './overview-result.component.html',
  styleUrls: ['./overview-result.component.scss'],
})
export class OverviewResultComponent implements OnInit {
  @Output() loadUser: EventEmitter<number> = new EventEmitter<number>();
  @Input() results: SessionResult[];
  @Input() users: User[];

  chartOptions: ChartOptions;
  countResultByUser: any[] = [];

  constructor() {}

  ngOnInit(): void {
    const usersIds = this.results.map((result) => result.user.id);
    const counter = countBy(usersIds);
    const counterMinutes = {};
    Object.keys(counter).forEach((userId) => {
      const userResults = this.results.filter((result) => result.user.id == parseInt(userId));

      let minutesDuration = moment.duration('00:00:00');
      userResults.forEach((userResult) => {
        minutesDuration.add(moment.duration(moment(userResult.ended_at).diff(moment(userResult.started_at))));
      });

      counterMinutes[userId] = moment(minutesDuration.asMilliseconds() / userResults.length, 'x').format('mm:ss\\s');
    });

    this.countResultByUser = this.users
      .map((user: User) => ({
        fullname: user.getName(),
        mediaTempo: counterMinutes[user.id],
        id: user.id,
        x: user.name ?? user.alias,
        y: counter[user.id] ?? 0,
      }))
      .sort(function (a, b) {
        return b.y - a.y;
      })
      .filter((item) => item.y > 0);

    this.chartOptions = {
      series: [{ data: this.countResultByUser.map((item) => ({ x: item.y + ' - ' + item.x, y: item.y })) }],

      yaxis: {
        title: {
          text: 'Número de execuções',
        },
      },
    };
  }

  doLoadUser(userId: number) {
    this.loadUser.emit(userId);
  }
}
