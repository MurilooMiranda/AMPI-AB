import { User } from './user.model';

export class Participant {
  id: number;
  alias: string;
  user?: User;
}
