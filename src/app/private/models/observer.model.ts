import { Address } from './address.model';
import { User } from './user.model';

export class Observer {
  id: number;
  phoneNumber: string;
  photoUrl: string;
  role: string;
  about: string;
  birthdate: Date;
  schooling: string;
  institution: string;
  address: Address;
  user?: User;

  constructor(observer: any = {}) {
    this.id = observer.id;
    this.phoneNumber = observer.phoneNumber;
    this.photoUrl = observer.photoUrl;
    this.role = observer.role;
    this.about = observer.about;
    this.birthdate = observer.birthdate;
    this.schooling = observer.schooling;
    this.institution = observer.institution;
    this.user = new User(observer.user);
  }
}
