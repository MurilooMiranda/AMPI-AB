import { Permission } from './permission.model';

export class Role {
  id: number;
  name: string = '';
  permissions?: Permission[];
  constructor(event: any = {}) {}
}
