import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import { ComplexCondition } from 'src/app/private/models/event.model';
import { v4 as uuid } from 'uuid';

import { COMPLEX_CONDITIONS } from '../../../constants';

@Component({
  selector: 'esm-complex-conditions',
  templateUrl: './complex-conditions.component.html',
  styleUrls: ['./complex-conditions.component.scss'],
})
export class ComplexConditionComponent implements OnInit {
  complexConditions: { text: string; complexConditions: ComplexCondition[] }[] = cloneDeep(COMPLEX_CONDITIONS);
  uid: string = uuid();
  openComplex: boolean = false;

  @Input() eventComplexConditions: ComplexCondition[];
  @Output() response: EventEmitter<ComplexCondition[]> = new EventEmitter<ComplexCondition[]>();

  ngOnInit() {
    if (this.eventComplexConditions) {
      this.eventComplexConditions.forEach((it) => {
        // Atualiza o [value] da lista complex conditions
        this.complexConditions
          .map((item) => item.complexConditions)
          .flat(1)
          .find((item) => item.condition == it.condition && item.action == it.action).value = true;
      });
    }
  }

  changeCondition() {
    let selectedComplexConditions = this.complexConditions
      .map((item) => item.complexConditions)
      .flat(1)
      .filter((it) => it.value)
      .map((item) => {
        return {
          condition: item.condition,
          action: item.action,
        } as ComplexCondition;
      });

    this.response.emit(selectedComplexConditions);
  }
}
