export class Permission {
  id: number;
  name: string = '';
  checked: boolean;
  constructor(event: any = {}) {
    this.id = event.id;
    this.name = event.name;
  }
}
