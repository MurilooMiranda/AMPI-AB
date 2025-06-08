import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { InterventionComplexCondition, QuestionIntervention } from 'src/app/private/models/intervention.model';
import { SwalService } from 'src/app/services/swal.service';
import { isNullOrUndefined } from 'src/app/util/functions';

import { HTMLInterventionElement, InterventionService } from '../../intervention.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'esm-unique-choice',
  templateUrl: './unique-choice.component.html',
})
export class UniqueChoiceComponent implements OnInit {
  @Input() intervention: QuestionIntervention;
  @Input() graphIndex: number;

  form: FormGroup = this.formBuilder.group({
    condition: ['ANSWER INDIFFERENT', Validators.required],
    alternative: ['', Validators.required],
    repeatNumber: [1, Validators.required],
    repeatMessage: [null, Validators.required],
    continueMessage: [null, Validators.required],
  });

  complexConditionsItems = [
    {
      value: 'ANSWER DIFFERENT',
      name: 'Diferente de',
      requireOption: true,
    },
    {
      value: 'ANSWER EQUALS',
      name: 'Igual a',
      requireOption: true,
    },
    {
      value: 'ANSWER INDIFFERENT',
      name: 'Indiferente',
      requireOption: false,
    },
  ];

  trackByFn(index, item) {
    return index;
  }

  get selectedCondition() {
    return this.complexConditionsItems.find((item) => item.value == this.form.get('condition').value) || null;
  }

  get alternatives() {
    return this.intervention?.options;
  }
  get conditions() {
    return this.intervention?.conditions;
  }
  get complexConditions() {
    return this.intervention?.complex_conditions;
  }

  get hasComplexConditions() {
    return !isNullOrUndefined(this.complexConditions);
  }

  get interventionComponentsInstance(): HTMLInterventionElement[] {
    return this.interventionService.graphElements.map((interventionComponent) => interventionComponent);
  }

  get conditionsLength() {
    return Object.keys(this.intervention.conditions).length;
  }

  constructor(
    private interventionService: InterventionService,
    private readonly _swalService: SwalService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.conditionsLength == 0) {
      this.addChoice();
    }

    this.interventionService.newInterventions$.subscribe((value) => {
      if (this.interventionService.lastInteractedIntervention === this.graphIndex) {
        let change = false;
        for (const alternative of this.alternatives) {
          if (isNullOrUndefined(this.conditions[alternative])) {
            this.conditions[alternative] = value.graphIndex;
            change = true;
          }
        }

        if (!change) {
          this.addChoice(value.graphIndex);
        }
      }
    });

    this.interventionService.removeIntervention$.subscribe((value) => {
      for (const alternative of this.alternatives.filter((v, i, a) => a.indexOf(v) === i)) {
        if (this.conditions[alternative] === value) {
          this.conditions[alternative] = null;
        }

        if (this.conditions[alternative] > value) {
          this.conditions[alternative]--;
        }
      }
    });

    if (this.hasComplexConditions) {
      this.complexConditionsItems.forEach((item) => {
        if (this.complexConditions.condition.includes(item.value)) {
          this.form.get('condition').setValue(item.value);
        }
      });

      const match = this.complexConditions.action.match(/(?<=\[)[^\][]*(?=])/g) ?? [];
      const values = match.length > 1 ? match.slice(0, 2) : ['', ''];


      this.form.get('repeatMessage').setValue(values[0]);
      this.form.get('continueMessage').setValue(values[1]);

      let repeatNumberMatches = this.complexConditions.condition.match(/(?<=ATTEMPTS LESS_THAN )[^]*/g);
      let repeatNumber = repeatNumberMatches ? repeatNumberMatches[0] : 1;
      this.form.get('repeatNumber').setValue(repeatNumber);

      let alternativeSelectedMatches = this.complexConditions.condition.match(/(?<=\[)[^\][]*(?=])/g);
      let alternativeSelected = alternativeSelectedMatches ? alternativeSelectedMatches[0] : null;
      let alternativeIndex = this.alternatives.indexOf(alternativeSelected);

      this.form.get('alternative').setValue(alternativeIndex > -1 ? alternativeIndex : '');
    }

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.updateComplexConditionCondition();
    });
  }

  verifyRepeatNumber() {
    const repeatNumber = this.form.get('repeatNumber');

    if (isNullOrUndefined(repeatNumber.value) || repeatNumber.value <= 0) {
      repeatNumber.setValue(1);
    }
  }

  updateComplexConditionCondition() {
    if (!this.hasComplexConditions) {
      return;
    }

    let selectCondition = this.form.get('condition').value;
    let selectOption = this.form.get('alternative').value;
    let repeatNumber = this.form.get('repeatNumber').value || 1;
    let repeatMessage = this.form.get('repeatMessage').value || '';
    let continueMessage = this.form.get('continueMessage').value || '';

    let selectedAlternative = this.alternatives[selectOption] || '';
    let dependentConditions = '';
    let action = '';

    if (selectCondition == 'ANSWER DIFFERENT') {
      dependentConditions = selectCondition + ' [' + selectedAlternative + '] AND ATTEMPTS LESS_THAN ' + repeatNumber;
    } else if (selectCondition == 'ANSWER EQUALS') {
      dependentConditions = selectCondition + ' [' + selectedAlternative + '] AND ATTEMPTS LESS_THAN ' + repeatNumber;
    } else if (selectCondition == 'ANSWER EQUALS') {
      dependentConditions = selectCondition + '[' + selectedAlternative + ']';
    } else if (selectCondition == 'ANSWER INDIFFERENT') {
      dependentConditions = `ATTEMPTS LESS_THAN ${repeatNumber}`;
    }

    action = 'LOOP [' + repeatMessage + '] [' + continueMessage + ']';

    this.complexConditions.action = action;
    this.complexConditions.condition = dependentConditions;
  }

  toChar(num: number) {
    return String.fromCharCode(num);
  }

  addChoice(graphIndex: number = null) {
    const text = '';
    this.alternatives.push(text);
    if (isNullOrUndefined(this.conditions[text])) {
      this.conditions[text] = graphIndex;
    }
    this.updateEdges();
  }

  removeChoice(choiceIndex: number) {
    let alternative = this.intervention.options[choiceIndex];
    this.alternatives.splice(choiceIndex, 1);

    if (this.alternatives.indexOf(alternative) == -1) {
      delete this.intervention.conditions[alternative];
    }

    let repeatAlternativeSelected = this.form.get('alternative').value;

    if (repeatAlternativeSelected == choiceIndex) {
      this.form.get('alternative').setValue('');
    }

    if (repeatAlternativeSelected > choiceIndex) {
      this.form.get('alternative').setValue(repeatAlternativeSelected - 1);
    }

    this.updateEdges();
  }

  updateEdges() {
    this.interventionService.removeEdges(this.graphIndex);

    for (const alternative of this.alternatives) {
      if (!isNullOrUndefined(this.conditions[alternative])) {
        this.interventionService.setNextFromTo(this.graphIndex, Number.parseInt(this.conditions[alternative]));
      }
    }
  }

  setNextTo() {
    this.updateEdges();
  }

  toggleComplexConditions() {
    if (this.hasComplexConditions) {
      this.removerComplexConditions();
    } else {
      this.intervention.complex_conditions = new InterventionComplexCondition();
      this.updateComplexConditionCondition();
    }
  }

  removerComplexConditions() {
    this._swalService
      .confirm('Tem certeza que deseja remover a repetição da intervenção?', 'repetição', 'Remover', 'REMOVER')
      .then((result) => {
        if (result.isConfirmed) {
          this.intervention.complex_conditions = null;
        }
      });
  }

  onTextChange(alternativeIndex: number, oldAlternative: string, newAlternative: string) {
    this.conditions[newAlternative] = this.conditions[oldAlternative];
    this.alternatives[alternativeIndex] = newAlternative;
    // Tratamento para textos iguais
    if (this.alternatives.indexOf(oldAlternative) == -1) {
      delete this.conditions[oldAlternative];
    }

    if (this.hasComplexConditions) {
      this.updateComplexConditionCondition();
    }
  }

  onNextChange(alternative: string, nextSelected: string) {
    this.conditions[alternative] = nextSelected;
  }
}
