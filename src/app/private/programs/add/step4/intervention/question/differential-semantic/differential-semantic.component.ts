import { Component, Input, OnInit } from '@angular/core';
import { QuestionIntervention } from 'src/app/private/models/intervention.model';

import { InterventionService } from '../../intervention.service';

@Component({
  selector: 'esm-differential-semantic',
  templateUrl: './differential-semantic.component.html',
})
export class DifferentialSemanticComponent implements OnInit {
  @Input() intervention: QuestionIntervention;
  @Input() graphIndex: number;

  trackByFn(index, item) {
    return index;
  }

  constructor(private interventionService: InterventionService) {}

  ngOnInit(): void {
    if (this.intervention.scales.length == 0) {
      this.intervention.scales.push('5');
      this.addChoice();
    }

    if (this.intervention.scales.length == 1) {
      this.addChoice();
    }

    // Corrige escalas impares
    if ((this.intervention.scales.length - 1) % 2 !== 0) {
      this.intervention.scales.push('');
    }
  }

  addChoice() {
    this.intervention.scales.push('');
    this.intervention.scales.push('');
  }

  removeChoice(choiceIndex: number) {
    this.intervention.scales.splice(choiceIndex, 2);
  }
}
