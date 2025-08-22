import { Intervention } from './intervention.model';
import { Media } from './media';
import { Sensor } from './sensor.model';
import { Trigger } from './trigger.model';

export class ComplexCondition {
  text?: string;
  action: string;
  condition: string;
  value?: boolean = false;
}

export class Badge {
  id: number;
  name: string = '';
  media: Media;
  constructor(badge: any = {}) {
    this.id = badge.id;
    this.name = badge.name;
    this.media = badge.media;
  }
}
export class GamificationConditions {
  completion_points: number;
  completion_half_points: number;
  uncomplete_points: number;
  badges: Badge[];

  constructor(data: any = {}) {
    this.completion_points = data.completion_points ?? 0;
    this.completion_half_points = data.completion_half_points ?? 0;
    this.uncomplete_points = data.uncomplete_points ?? 0;
    this.badges = data.badges ?? [];
  }
}

export class Event {
  id: number;
  title: string = '';
  description: string = '';
  color: string = '';
  type: string = 'passive';
  sensors: Array<Sensor> = [];
  complexConditions: ComplexCondition[];
  triggers: Array<Trigger> = [];

  constructor(event: any = {}) {}
}

export class ActiveEvent extends Event {
  interventions: Array<Intervention> = [];
  gamificationConditions: GamificationConditions;
  constructor(event: any = {}) {
    super(event);
    this.type = 'active';
    this.gamificationConditions = event.gamificationConditions;
  }
}
