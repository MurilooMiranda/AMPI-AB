import { Injectable } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import { Subject } from 'rxjs';
import {
  Intervention,
  MediaIntervention,
  QuestionIntervention,
  TaskIntervention,
  TaskPythonIntervention,
} from 'src/app/private/models/intervention.model';
import { LocalStorageService } from 'src/app/security/login/local-storage.service';
import { SwalService } from 'src/app/services/swal.service';
import { isNullOrUndefined } from 'src/app/util/functions';
import { Helper } from 'src/app/util/helpers';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class InterventionService {
  lastInteractedIntervention: number;
  interventionElementsGraph: number[][] = [];
  graphElements: HTMLInterventionElement[] = [];

  clearBoard$: Subject<void> = new Subject<void>();
  redrawGraph$: Subject<void> = new Subject<void>();
  removeIntervention$: Subject<number> = new Subject<number>();
  hasMultiplePaths: boolean = false;

  // interventionElementsGraph: number[][];
  newInterventions$: Subject<{ graphIndex: number; intervention: HTMLInterventionElement }> = new Subject<{
    graphIndex: number;
    intervention: HTMLInterventionElement;
  }>();
  // removeIntervention$: Subject<number> = new Subject<number>();
  firstInterventionChange$: Subject<number> = new Subject<number>();

  states: any[] = [];
  currentState: number = -1;
  constructor(private readonly _localStorageService: LocalStorageService, private readonly _swalService: SwalService) {}

  get firstIntervention(): number {
    return this.graphElements.findIndex((value) => value.intervention.first == true);
  }

  init(interventions: Intervention[]) {
    this.states = [];
    this.currentState = -1;
    this.loadState(interventions);

    this.saveState();
  }

  fixOrderAndNextForOldSPIMInterventions(interventions: Intervention[]) {
    // Old espim did not save order position correctly, so here we have to correct
    interventions.sort((a, b) => {
      if (a.graph_index < b.graph_index) {
        return -1;
      } else if (a.graph_index > b.graph_index) {
        return 1;
      } else {
        return 0;
      }
    });

    // Old espim did not save order position correctly, so here we have to correct
    const orderPositions = {};
    interventions.forEach(function (element, key) {
      orderPositions[element.graph_index] = key;
    });

    interventions.map((intervention, mapIndex) => {
      intervention.graph_index = mapIndex;

      if (intervention.type === 'question' && (intervention as QuestionIntervention).question_type == 1) {
        let question = intervention as QuestionIntervention;

        Object.keys(question.conditions).map((key) => {
          question.conditions[key] = !isNullOrUndefined(orderPositions[question.conditions[key]])
            ? orderPositions[question.conditions[key]]
            : null;
        });
      }

      intervention.next = !isNullOrUndefined(orderPositions[intervention.next]) ? orderPositions[intervention.next] : null;
    });

    return interventions;
  }

  nextState() {
    if (this.currentState < this.states.length - 1) {
      this.saveCurrentState();

      var state = this.states[++this.currentState];
      this.loadState(state);
    }
  }

  previousState() {
    if (this.currentState > 0) {
      this.saveCurrentState();

      var state = this.states[--this.currentState];
      this.loadState(state);
    }
  }

  saveState() {
    let state = cloneDeep(this.getCurrentState());

    if (this.currentState != this.states.length - 1) {
      this.states.splice(this.currentState + 1);
    }

    if (this.states.length == 50) {
      this.states.shift();
    }

    this.states.push(state);
    this.currentState = this.states.length - 1;

    var jsonState = JSON.stringify(state);
    // localStorage.setItem('EDITOR_STATE', jsonState);
  }

  // Salva o step atual antes dele excluir/adicionar
  // Pra ficar salvo os dados gerais
  saveCurrentState() {
    let state = cloneDeep(this.getCurrentState());
    this.states[this.currentState] = state;
  }

  loadState(state: Intervention[]) {
    let stateToLoad = cloneDeep(state);

    // order position correctly by graphIndex
    stateToLoad.sort((a, b) => {
      if (a.graph_index < b.graph_index) {
        return -1;
      } else if (a.graph_index > b.graph_index) {
        return 1;
      } else {
        return 0;
      }
    });

    this.clearBoard$.next();
    this.graphElements = [];
    this.interventionElementsGraph = [];
    this.lastInteractedIntervention = null;

    this.loadInterventions(stateToLoad);
  }

  getCurrentState() {
    this.graphElements.forEach((element, index) => {
      // if the intervention is of unique choice, it is already up to date (it gets updated in unique-choice.component.ts)
      // else we must updated intervention.next to the first and only intervention it points
      if ((element.intervention as QuestionIntervention).question_type !== 1) {
        element.intervention.next = this.interventionElementsGraph[index][0];
      }
    });

    return this.graphElements.map((value) => value.intervention);
  }

  loadInterventions(interventionsArray: Intervention[]) {
    let interventions = interventionsArray.map((item) => {
      return this.transformToClass(item);
    });

    // Popula as variaveis de controle
    // E adiciona os elementos
    interventions.forEach((i: HTMLInterventionElement, index) => {
      // Converte o .next ou o .conditions para o interventionElementsGraph
      if ((i.intervention as QuestionIntervention).question_type !== 1) {
        this.interventionElementsGraph.push([i.intervention.next]);
      } else {
        let questionIntervention = i.intervention as QuestionIntervention;
        let arrowsIndexes = Object.values(questionIntervention.conditions).filter(function (item, pos, self) {
          return self.indexOf(item) == pos;
        }) as number[];

        this.interventionElementsGraph.push(arrowsIndexes);
      }
      this.graphElements.push(i);

      // Evento para adicionar o componente na tela
      this.newInterventions$.next({ graphIndex: index, intervention: i });
    });

    this.redrawGraph$.next();
  }

  transformToClass(data: Intervention): HTMLInterventionElement {
    return new HTMLInterventionElement(this.getInterventionClass(data));
  }

  /*
   getInterventionClass(
    data: Intervention
  ): Intervention | MediaIntervention | QuestionIntervention | TaskIntervention | CalendarIntervention | TaskPythonIntervention {
    let intervention: Intervention;

    if (data.type === 'empty') intervention = new Intervention(data);
    else if (data.type === 'media') intervention = new MediaIntervention(data);
    else if (data.type === 'question') intervention = new QuestionIntervention(data);
    else if (data.type === 'task') intervention = new TaskIntervention(data);
    else if (data.type === 'calendar') intervention = new CalendarIntervention(data);
    else if (data.type === 'taskpython') intervention = new TaskPythonIntervention(data);

    return intervention;
  */

  getInterventionClass(data: Intervention): Intervention | MediaIntervention | QuestionIntervention | TaskIntervention {
    return Helper.getInterventionClass(data);
  }

  addIntervention(intervention: HTMLInterventionElement) {
    this.saveCurrentState();

    if (!isNullOrUndefined(this.lastInteractedIntervention)) {
      if (
        this.graphElement(this.lastInteractedIntervention).intervention instanceof QuestionIntervention &&
        (this.graphElement(this.lastInteractedIntervention).intervention as QuestionIntervention).question_type == 1
      ) {
        this.interventionElementsGraph[this.lastInteractedIntervention].push(this.interventionElementsGraph.length);
      } else if (!isNullOrUndefined(this.interventionElementsGraph[this.lastInteractedIntervention])) {
        this.interventionElementsGraph[this.lastInteractedIntervention] = [this.interventionElementsGraph.length];
      }
    }

    if (this.graphElements.length == 0) {
      intervention.first = true;
    }

    this.interventionElementsGraph.push([null]);
    this.graphElements.push(intervention);

    this.newInterventions$.next({ graphIndex: this.graphElements.length - 1, intervention });
    this.redrawGraph$.next();
    this.saveState();
  }

  removeIntervention(graphIndex: number) {
    this.saveCurrentState();

    var deletedGraphElement = this.graphElement(graphIndex);

    this.interventionElementsGraph.splice(graphIndex, 1);
    this.graphElements.splice(graphIndex, 1);

    for (const intervention of this.interventionElementsGraph) {
      let i = 0;
      while (i < intervention.length) {
        if (intervention[i] == graphIndex) {
          intervention[i] = null;
        } else if (intervention[i] > graphIndex) {
          intervention[i]--;
          i++;
        } else {
          i++;
        }
      }
    }
    if (this.interventionElementsGraph.length == 0) {
      this.lastInteractedIntervention = null;
    }

    this.removeIntervention$.next(graphIndex);
    this.redrawGraph$.next();

    this.saveState();
  }

  graphElement(i: number) {
    return this.graphElements[i];
  }

  setNextFromTo(from: number, to: number) {
    if (this.hasArrow(from, to)) {
      return;
    }

    this.interventionElementsGraph[from].push(to);
    this.redrawGraph$.next();
  }

  private hasArrow(from: number, to: number) {
    for (const intervention of this.interventionElementsGraph[from]) {
      if (intervention === to) {
        return true;
      }
    }
    return false;
  }

  removeEdges(vertice: number, emit: boolean = true) {
    this.interventionElementsGraph[vertice] = [];
    if (emit) {
      this.redrawGraph$.next();
    }
  }

  warnCycle(intervention: number) {
    // this._swalService.warning(`Intervenção ${intervention} resulta em um ciclo`, 'Ciclo detectado', 'success', false);
  }

  setFirst(graphIndex: number) {
    this.firstInterventionChange$.next(graphIndex);
    this.redrawGraph$.next();
  }
}

export class HTMLInterventionElement {
  uuid: string = uuid();
  onChange$: Subject<HTMLInterventionElement> = new Subject<HTMLInterventionElement>();

  constructor(
    public intervention?: Intervention,
    public _x?: number,
    public _y?: number,
    public _width?: number,
    public _height?: number
  ) {}

  get x() {
    return this._x;
  }
  set x(x: number) {
    if (x !== this._x) {
      this._x = x;
      this.onChange$.next(this);
    }
  }

  get y() {
    return this._y;
  }
  set y(y: number) {
    if (y !== this._y) {
      this._y = y;
      this.onChange$.next(this);
    }
  }

  get width() {
    if (this._width) return this._width;
    else return 300;
  }
  set width(width: number) {
    if (width !== this._width) {
      this._width = width;
      this.onChange$.next(this);
    }
  }

  get height() {
    return this._height;
  }
  set height(height: number) {
    if (height !== this._height) {
      this._height = height;
      this.onChange$.next(this);
    }
  }

  get type() {
    return this.intervention?.type;
  }
  get question_type() {
    if (this.intervention instanceof QuestionIntervention) return (this.intervention as QuestionIntervention).question_type;
    return undefined;
  }
  get statement() {
    return this.intervention?.statement;
  }
  set statement(statement: string) {
    this.intervention.statement = statement;
  }
  get order_position() {
    return this.intervention?.order_position;
  }
  set order_position(order_position: number) {
    this.intervention.order_position = order_position;
  }
  get orderDescription() {
    return this.intervention.getOrderDescription();
  }
  get typeDescription() {
    return this.intervention?.getTypeDescription();
  }
  get first() {
    return this.intervention?.first;
  }
  set first(first: boolean) {
    this.intervention.first = first;
  }
  get obrigatory() {
    return this.intervention?.obrigatory;
  }
  set obrigatory(obrigatory) {
    this.intervention.obrigatory = obrigatory;
  }

  get top() {
    return { x: this.x, y: this.y - this.height / 2 };
  }
  get bottom() {
    return { x: this.x, y: this.y + this.height / 2 };
  }
  get left() {
    return { x: this.x - this.width / 2, y: this.y };
  }
  get right() {
    return { x: this.x + this.width / 2, y: this.y };
  }
}
