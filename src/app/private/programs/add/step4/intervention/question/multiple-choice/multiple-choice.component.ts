import { Component, Input, OnInit } from '@angular/core';
import { QuestionIntervention } from 'src/app/private/models/intervention.model';

import { InterventionService } from '../../intervention.service';

@Component({
  selector: 'esm-multiple-choice',
  templateUrl: './multiple-choice.component.html',
})
export class MultipleChoiceComponent implements OnInit {
  @Input() intervention: QuestionIntervention;
  @Input() graphIndex: number;

  constructor(private interventionService: InterventionService) {}

  trackByFn(index, item) {
    return index;
  }

  ngOnInit(): void {
    if (this.intervention.options.length == 0) {
      this.addChoice();
      this.addChoice();
    }
  }

  addChoice() {
    this.intervention.options.push('');
  }

  removeChoice(choiceIndex: number) {
    this.intervention.options.splice(choiceIndex, 1);
  }
}
