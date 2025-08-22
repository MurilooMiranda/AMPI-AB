import { Helper } from 'src/app/util/helpers';

import { Intervention } from './intervention.model';
import { Media } from './media';
import { User } from './user.model';

export class Result {
  id: number;
  event_intervention_id: number;
  started_at: string = '';
  ended_at: string = '';
  answer: string = '';
  media: Media;
  intervention: Intervention;

  constructor(result: any = {}) {
    this.id = result.id;
    this.event_intervention_id = result.event_intervention_id;
    this.started_at = result.started_at;
    this.ended_at = result.ended_at;
    this.answer = result.answer;
    this.media = result.media;
    this.intervention = result.intervention ? Helper.getInterventionClass(result.intervention) : null;
  }
}

export class SessionResult {
  id: number;
  started_at: string = '';
  ended_at: string = '';
  user: User;
  results: Result[];

  constructor(result: any = {}) {
    this.started_at = result.started_at;
    this.ended_at = result.ended_at;
    this.user = result.user ? new User(result.user) : null;

    this.results = result.results ? result.results.map((result) => new Result(result)) : [];
  }
}
