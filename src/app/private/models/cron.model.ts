import { Day } from './date.model';

export class Cron {
  private minutes: string;
  private hours: string;
  private dom: string;
  private month: string;
  private dow: Array<string>;

  constructor(cronString: string = '0 0 * * *') {
    cronString.replace(new RegExp('undefined', 'g'), '*');

    const cronArray = cronString.split(' ');

    // Correção do espim antigo, onde era armazenado ano e segundos no CRON
    if (cronArray.length == 7) {
      cronArray.shift();
    }
    this.minutes = cronArray[0];
    this.hours = cronArray[1];
    this.dom = cronArray[2] === '?' ? '*' : cronArray[3];
    this.month = cronArray[3];
    this.dow = cronArray[4].split(',');
    if (this.dow[0] === '*') {
      this.dow = [];
    }
  }

  getMinute() {
    return this.minutes;
  }
  setMinute(minute: string) {
    this.minutes = minute;
  }
  getHours() {
    return this.hours;
  }
  setHour(hours: string) {
    this.hours = hours;
  }
  getDow() {
    return this.dow;
  }

  isDayActive(day?: string) {
    if (day) return !!this.dow.find((value) => value === day);
    else return this.dow.length === 7;
  }
  actOrDeactivateDay(day?: string) {
    if (day) {
      const dayIndex = this.dow.findIndex((value) => value === day);
      if (dayIndex === -1) {
        this.dow.push(day);
        this.dow.sort();
      } else this.dow.splice(dayIndex, 1);
    } else {
      const areAllMarked = this.isDayActive();
      this.dow.splice(0, this.dow.length);
      if (!areAllMarked) for (let i = 1; i <= 7; i++) this.dow.push(i.toString());
    }
  }

  activeDay(day?: Day) {
    const dayIndex = this.dow.findIndex((value) => value === day.cronName);
    if (dayIndex === -1) {
      this.dow.push(day.cronName);
      this.dow.sort();
    }
  }

  convertFromForm(time: Date, days: Day[] = []) {
    if (!time || !(time instanceof Date)) {
      return '';
    }

    this.setHour(time.getHours().toString());
    this.setMinute(time.getMinutes().toString());

    days.forEach((day: Day) => {
      this.activeDay(day);
    });
  }

  toString() {
    return `${this.minutes} ${this.hours} ${this.dom} ${this.month} ${this.dow.length == 0 ? '*' : this.dow}`;
  }
}
