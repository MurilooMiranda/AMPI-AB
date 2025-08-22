export class Hour {
  time: Date;
  timeout: string = '';
  notificationType: string = '';
}

export class Day {
  alias: string = '';
  cronName: string = '';
  name: string = '';
  hours: Hour[];
}
