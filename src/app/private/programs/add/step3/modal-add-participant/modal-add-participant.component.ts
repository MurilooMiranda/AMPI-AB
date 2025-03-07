import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Participants } from 'src/app/app.api';
import { DAOService } from 'src/app/private/dao/dao.service';
import { User } from 'src/app/private/models/user.model';
import { LoaderService } from 'src/app/services/loader.service';
import { FormUtil } from 'src/app/util/util.form.service';

@Component({
  selector: 'esm-modal-add-participant',
  templateUrl: './modal-add-participant.component.html',
  styleUrls: ['./modal-add-participant.component.scss'],
})
export class ModalAddParticipantComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;
  @Output() response: EventEmitter<User> = new EventEmitter<User>();

  urlParticipants: string = ESPIM_REST_Participants;
  form: UntypedFormGroup = this.formBuilder.group({
    email: this.formBuilder.control('', [Validators.required]),
    alias: this.formBuilder.control('', [Validators.required]),
    user:  this.formBuilder.group({
      profession: this.formBuilder.control(''),
    }),
  });

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: UntypedFormBuilder,
    private _toastr: ToastrService,
    private _loaderService: LoaderService,
    private _daoService: DAOService
  ) {}

  ngOnInit(): void {}

  close() {
    this.bsModalRef.hide();
  }

  save() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      var dados = { ...this.form.value };
      this._loaderService.show();

      this._daoService
        .postObject(this.urlParticipants, dados)
        .pipe(finalize(() => this._loaderService.hide()))
        .subscribe((response) => {
          this.form.patchValue({
            email: response.data.email,
            alias: response.data.alias,
          });
          if (response.data.user) {
            this.form.patchValue({
              user: {
                profession: response.data.user.profession,
              },
            });
          }
        });
    }
  }
}
