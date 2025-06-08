import { isNullOrUndefined, toChar } from 'src/app/util/functions';

import { Media } from './media';

export class Intervention {
  public id: number;
  public type: string;
  public statement: string = '';
  public order_position: number;
  public graph_index: number;
  public first: boolean;
  public next: number;
  public obrigatory: boolean = false;
  public x: number;
  public y: number;

  public medias: Media[];

  constructor(intervention: any = {}) {
    this.id = intervention.id;
    this.statement = intervention.statement ?? '';
    this.order_position = intervention.order_position;
    this.graph_index = intervention.graph_index;
    this.first = !isNullOrUndefined(intervention.first) ? intervention.first : false;
    this.next = intervention.next;

    this.obrigatory = true;

    this.medias = intervention.medias ?? [];

    this.x = intervention.x;
    this.y = intervention.y;

    this.type = 'empty';
  }

  getTypeDescription() {
    return 'Mensagem';
  }

  getOrderDescription() {
    return this.order_position < 0 ? toChar(this.order_position * -1) : this.graph_index + 1;
  }

  getOrderDescriptionByPosition() {
    return this.order_position < 0 ? toChar(this.order_position * -1) : this.order_position + 1;
  }

  getDescription() {
    if (this.statement) {
      return this.statement;
    } else {
      return 'Sem descrição';
    }
  }

  getEnunciado() {
    return this.getOrderDescription() + ' - ' + this.getTypeDescription() + ' - ' + this.getDescription();
  }
}

export class MediaIntervention extends Intervention {
  public media_type: string = '';

  constructor(intervention: any = {}) {
    super(intervention);

    this.media_type = intervention.media_type ? intervention.media_type : '';
    this.type = 'media';
    this.obrigatory = !isNullOrUndefined(intervention.obrigatory) ? intervention.obrigatory : false;
  }

  getTypeDescription() {
    return 'Solicitar Mídia';
  }
}

export class CalendarIntervention extends Intervention {
  constructor(intervention: any = {}) {
    super(intervention);
    this.type = 'calendar';
    this.obrigatory = !isNullOrUndefined(intervention.obrigatory) ? intervention.obrigatory : false;
  }

  getTypeDescription() {
    return 'Abrir calendário';
  }
}

export class QuestionIntervention extends Intervention {
  public question_type: number;
  public conditions: {};
  public options: string[];
  public scales: string[];
  public complex_conditions: InterventionComplexCondition;

  constructor(intervention: any = {}) {
    super(intervention);

    // Se for igual a 1, é obrigatório
    if (intervention.question_type !== 1) {
      this.obrigatory = !isNullOrUndefined(intervention.obrigatory) ? intervention.obrigatory : false;
    }

    this.question_type = intervention.question_type;
    // Necessário o conditions ser do tipo object
    this.conditions = isNullOrUndefined(intervention.conditions) || intervention.conditions.length == 0 ? {} : intervention.conditions;
    this.options = intervention.options || [];
    this.scales = intervention?.scales || [];

    this.complex_conditions = intervention.complex_conditions || null;

    this.type = 'question';
  }

  getTypeDescription() {
    if (this.question_type === 0) return 'Questão aberta';
    if (this.question_type === 1) return 'Escolha única';
    if (this.question_type === 2) return 'Múltipla escolha';
    if (this.question_type === 3) return 'Likert';
    if (this.question_type === 4) return 'Diferencial semântico';
    if (this.question_type === 31) return 'Likert personalizado';
    return 'Mensagem';
  }
}

export class TaskIntervention extends Intervention {
  app_package: string;
  parameters: object;
  start_from_notification: boolean;

  constructor(intervention: any = {}) {
    super(intervention);

    this.obrigatory = !isNullOrUndefined(intervention.obrigatory) ? intervention.obrigatory : false;
    this.app_package = intervention.app_package ? intervention.app_package : '';

    if (intervention.parameters && Object.keys(intervention.parameters).length == 0 && intervention.app_package) {
      intervention.parameters[intervention.app_package] = '';
    }

    this.parameters = intervention.parameters ? intervention.parameters : {};
    this.start_from_notification = intervention.start_from_notification;
    this.type = 'task';
  }

  getTypeDescription() {
    return 'Aplicação externa';
  }
}

export class InterventionComplexCondition {
  action: string;
  condition: string;
  constructor(dados: any = {}) {
    this.condition = dados.action || '';
    this.action = dados.condition || '';
  }
}

export class TaskPythonIntervention extends Intervention {
  public media_type: string = '';

  constructor(intervention: any = {}) {
    super(intervention);

    this.media_type = intervention.media_type ? intervention.media_type : 'application/zip';
    this.type = 'taskpython';

    this.obrigatory = !isNullOrUndefined(intervention.obrigatory) ? intervention.obrigatory : false;
  }

  getTypeDescription() {
    return 'Corretor Python';
  }
}
