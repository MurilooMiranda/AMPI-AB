import { Component, Input } from '@angular/core';
import { MediaIntervention } from 'src/app/private/models/intervention.model';

@Component({
  selector: 'esm-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent {
  @Input() intervention: MediaIntervention;
  @Input() graphIndex: number;
}
