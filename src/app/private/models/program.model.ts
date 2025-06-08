import { Event } from './event.model';
import { Observer } from './observer.model';
import { User } from './user.model';

export class Program {
  id: number;
  title: string = '';
  description: string = '';
  starts: string = '';
  ends: string = '';
  updateDate: string = '';
  hasPhases: boolean = false;
  isPublic: boolean = false;
  beingEdited: boolean = false;
  beingDuplicated: boolean = false;
  // composed entities
  observer: Observer;
  observers: Array<Observer> = [];
  passiveEvents: Array<Event> = [];
  activeEvents: Array<Event> = [];
  activeEventsWithResults: Array<Event> = [];
  users: Array<User> = [];

  constructor(program: any = {}) {}
}
