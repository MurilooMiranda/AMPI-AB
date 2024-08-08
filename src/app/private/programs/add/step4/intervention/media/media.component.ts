import { Component, Input } from '@angular/core';
import { MediaIntervention } from 'src/app/private/models/intervention.model';

export class MediaComponent {
  @Input() intervention: MediaIntervention;
  @Input() graphIndex: number;
}
