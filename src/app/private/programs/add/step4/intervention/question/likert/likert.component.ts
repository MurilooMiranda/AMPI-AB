import { Component, Input, OnInit } from '@angular/core';
import { QuestionIntervention } from 'src/app/private/models/intervention.model';

import { InterventionService } from '../../intervention.service';

@Component({
  selector: 'esm-likert',
  templateUrl: './likert.component.html',
})
export class LikertComponent implements OnInit {
  @Input() intervention: QuestionIntervention;
  @Input() graphIndex: number;

  trackByFn(index, item) {
    return index;
  }

  // Normal Likert only has 1 scale
  get scale() {
    return this.intervention.scales[0];
  }
  set scale(scale) {
    this.intervention.scales[0] = scale;
  }

  constructor(private interventionService: InterventionService) {}

  ngOnInit(): void {
    this.scale = '5 AGREEMENT';
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
