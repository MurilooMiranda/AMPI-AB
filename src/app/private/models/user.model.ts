import { Role } from './role.model';

export class User {
  id: number;
  alias: string;
  email: string;
  name: string;
  photoUrl?: string;
  roles?: Role[];
  permissions?: Array<string>;

  constructor(user: any = {}) {
    this.id = user.id;
    this.alias = user.alias;
    this.email = user.email;
    this.name = user.name;
    this.photoUrl = user.photoUrl;
    this.roles = user.roles;
    this.permissions = user.permissions;
  }

  getName(): string {
    return (this.name ? this.name : this.alias) + ' ' + `(${this.email})`;
  }
}
