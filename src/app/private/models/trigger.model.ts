import { Cron } from './cron.model';

export class Trigger {
  id: number;
  condition: Cron;
  priority: string;
  timeout: number;

  constructor(trigger: any = {}) {
    this.id = trigger.id || null;
    this.condition = trigger.condition instanceof Cron ? trigger.condition : new Cron(trigger.condition);
    this.priority = trigger.priority;
    this.timeout = trigger.timeout;
  }

  getDescription() {
    const dowNames = ['domingos', 'segundas', 'terças', 'quartas', 'quintas', 'sextas', 'sábados'];
    let ans;

    const dow = this.condition.getDow();
    if (dow.length == 0) {
      ans = 'Todos os dias ';
    } else {
      if (dow[0] === '1' || dow[0] === '7') ans = 'Todos os ';
      else ans = 'Todas as ';

      for (const day of dow) {
        ans += dowNames[parseInt(day) - 1];

        if (dow[dow.length - 1] === day) {
          ans += ' ';
          break;
        }

        if (dow.length >= 3) {
          if (day === dow[dow.length - 2]) ans += ' e ';
          else ans += ', ';
        } else if (dow.length === 2) ans += ' e ';
        else ans += ' ';
      }
    }

    if (this.priority === 'NC') ans += 'uma notificação curta ';
    else if (this.priority === 'NL') ans += 'uma notificação longa ';
    else if (this.priority === 'AL') ans += 'um alarme ';

    ans += 'às ' + this.getHour() + ':' + this.getMinutes();

    return ans;
  }
  getId() {
    return this.id;
  }

  getTriggerCondition() {
    return this.condition;
  }
  getPriority() {
    return this.priority;
  }
  setPriority(priority: string) {
    this.priority = priority;
  }
  getTimeOut() {
    return this.timeout;
  }
  getTimeOutInMinutes() {
    return this.timeout / 60000;
  }
  setTimeOutInMinutes(timeout: number | string) {
    if (typeof timeout === 'string') timeout = Number.parseInt(timeout);
    this.timeout = timeout * 60000;
  }

  isDayActive(day?: string) {
    return this.condition.isDayActive(day);
  }
  actOrDeactivateDay(day?: string) {
    this.condition.actOrDeactivateDay(day);
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0');
  }

  getMinutes() {
    return this.zeroPad(Number.parseInt(this.condition.getMinute()), 2);
  }
  getHour() {
    return this.zeroPad(Number.parseInt(this.condition.getHours()), 2);
  }
}
