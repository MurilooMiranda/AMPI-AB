import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import cloneDeep from 'lodash/cloneDeep';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { ActiveEvent } from 'src/app/private/models/event.model';
import { ProgramsAddService } from 'src/app/private/programs/add/programsadd.service';
import { InterventionComponent } from 'src/app/private/programs/add/step4/intervention/intervention.component';
import { InterventionService } from 'src/app/private/programs/add/step4/intervention/intervention.service';
import { LoaderService } from 'src/app/services/loader.service';

import { ESPIM_REST_Media } from '../../../app.api';
import { DAOService } from '../../dao/dao.service';
import { Media } from '../../models/media';

@Component({
  selector: 'esm-modal-midia',
  templateUrl: './modal-midia.component.html',
  styleUrls: ['./modal-midia.component.scss'],
})
export class ModalMidiaComponent implements OnInit {
  @Output() response: EventEmitter<Media> = new EventEmitter<Media>();
  @Output() responseIntervention: EventEmitter<InterventionComponent> = new EventEmitter<InterventionComponent>();
  @Input() activeEvent: ActiveEvent;
  urlUpload: string = ESPIM_REST_Media;
  file: any = null;
  constructor(
    public bsModalRef: BsModalRef,
    private sanitizer: DomSanitizer,
    private readonly _daoService: DAOService,
    private _loaderService: LoaderService,
    private interventionService: InterventionService,
    private programAddService: ProgramsAddService
  ) {}

  ngOnInit(): void {}

  selectFile(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let type = file.type.split('/')[0];
      // get event reference to intervention
      console.log(event);
      this.file = {
        type: type,
        file: file,
        url: this.sanitize(URL.createObjectURL(file)),
      };
    } else {
      this.file = null;
    }
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  close() {
    this.bsModalRef.hide();
  }

  uploadFile() {
    const formData: FormData = new FormData();
    formData.append('file', this.file.file);
    this._loaderService.show();
    this._daoService
      .postObject(this.urlUpload, formData)
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((resp) => {
        this.response.emit(resp.data);
        this.bsModalRef.hide();
      });
  }

  uploadZip() {
    let interventions = cloneDeep(this.interventionService.getCurrentState());
    console.log(this.programAddService.program.source.value.id);
    const formData: FormData = new FormData();
    formData.append('file', this.file.file);
    this._loaderService.show();
    this._daoService
      .postObject(this.urlUpload, formData)
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((resp) => {
        this.response.emit(resp.data);
        this.bsModalRef.hide();
      });
  }
}
