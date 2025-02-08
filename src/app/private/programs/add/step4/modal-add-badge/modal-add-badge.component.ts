import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import cloneDeep from 'lodash/cloneDeep';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Badges } from 'src/app/app.api';
import { DAOService } from 'src/app/private/dao/dao.service';
import { ActiveEvent, Badge } from 'src/app/private/models/event.model';
import { EndpointsService } from 'src/app/services/endpoints.service';
import { LoaderService } from 'src/app/services/loader.service';

import { ProgramsAddService } from '../../programsadd.service';

@Component({
  selector: 'esm-modal-add-badge',
  templateUrl: './modal-add-badge.component.html',
  styleUrls: ['./modal-add-badge.component.scss'],
})
export class ModalAddBadgeComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;
  @Output() response: EventEmitter<Badge> = new EventEmitter<Badge>();
  @Input() activeEvent: ActiveEvent;

  urlBadges: string = ESPIM_REST_Badges;
  form: UntypedFormGroup = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required]),
    media: this.formBuilder.control('', [Validators.required]),
  });
  private _modalMediaRef: BsModalRef;

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: UntypedFormBuilder,
    private readonly programAddService: ProgramsAddService,
    private readonly _endpointsService: EndpointsService,
    private readonly _loaderService: LoaderService,
    private readonly _daoService: DAOService
  ) {}

  ngOnInit(): void {}

  close() {
    this.bsModalRef.hide();
  }

  save() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      var dados = { ...this.form.value };

      if (this.activeEvent.id) {
        this._loaderService.show();

        let badgeToSave = this.programAddService.fixGamificationBadgeToSave(cloneDeep(dados));

        this._daoService
          .postObject(this._endpointsService.get(this.urlBadges, { activeEventId: this.activeEvent.id }), badgeToSave)
          .pipe(finalize(() => this._loaderService.hide()))
          .subscribe((resp) => {
            this.response.emit(new Badge(dados));
            this.bsModalRef.hide();
          });
      } else {
        this.response.emit(new Badge(dados));
        this.bsModalRef.hide();
      }
    }
  }

  adicionarMidia(media) {
    this.form.get('media').setValue(media);
  }
}
