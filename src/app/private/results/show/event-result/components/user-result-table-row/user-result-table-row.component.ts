import { Component, Input } from '@angular/core';
import moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalShowMidiaComponent } from 'src/app/private/components/modal-show-midia/modal-show-midia.component';
import { Media } from 'src/app/private/models/media';
import { Result, SessionResult } from 'src/app/private/models/result.model';

@Component({
  selector: '[esm-user-result-table-row]',
  templateUrl: './user-result-table-row.component.html',
  styleUrls: ['./user-result-table-row.component.scss'],
})
export class UserResultTableRowComponent {
  @Input() result: Result;

  constructor(private readonly _modalService: BsModalService) {}

  getDuracao(result: Result | SessionResult): string {
    if (!result.started_at) {
      return '0';
    }

    return this.getDuracaoMoment(result).format('mm:ss\\s');
  }

  getDuracaoMoment(result: Result | SessionResult): any {
    return moment(moment(result.ended_at).diff(result.started_at));
  }

  showMidia(media: Media): void {
    const config: ModalOptions<ModalShowMidiaComponent> = {
      class: 'modal-lg modal-media',
      initialState: {
        media: media,
      },
    };

    this._modalService.show(ModalShowMidiaComponent, config);
  }
}
