import {
  CalendarIntervention,
  Intervention,
  MediaIntervention,
  QuestionIntervention,
  TaskIntervention,
} from '../private/models/intervention.model';

export class Helper {
  static getInterventionClass(data: Intervention): Intervention | MediaIntervention | QuestionIntervention | TaskIntervention {
    let intervention: Intervention;

    if (data.type === 'empty') intervention = new Intervention(data);
    else if (data.type === 'media') intervention = new MediaIntervention(data);
    else if (data.type === 'question') intervention = new QuestionIntervention(data);
    else if (data.type === 'task') intervention = new TaskIntervention(data);
    else if (data.type === 'calendar') intervention = new CalendarIntervention(data);

    return intervention;
  }
}
