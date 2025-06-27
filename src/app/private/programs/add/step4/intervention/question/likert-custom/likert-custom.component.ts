import { Component, Input, OnInit } from '@angular/core';
import { QuestionIntervention } from 'src/app/private/models/intervention.model';

import { InterventionService } from '../../intervention.service';

@Component({
  selector: 'esm-likert-custom',
  templateUrl: './likert-custom.component.html',
})
export class LikertCustomComponent implements OnInit {
  @Input() intervention: QuestionIntervention;
  @Input() graphIndex: number;

  trackByFn(index, item) {
    return index;
  }

  constructor(private interventionService: InterventionService) {}

  ngOnInit(): void {
    if (this.intervention.scales.length == 0) {
      this.addChoice();
      this.addChoice();
      this.addChoice();
    }
  }

  addChoice() {
    this.intervention.scales.push('');
  }

  removeChoice(choiceIndex: number) {
    this.intervention.scales.splice(choiceIndex, 1);
  }
}
