import { Component, Input } from '@angular/core';
import { QuestionIntervention } from 'src/app/private/models/intervention.model';

export class QuestionComponent {
  @Input() intervention: QuestionIntervention;
  @Input() graphIndex: number;

  constructor() {}
}
