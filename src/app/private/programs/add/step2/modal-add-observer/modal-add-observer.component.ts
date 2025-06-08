import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Observers } from 'src/app/app.api';
import { DAOService } from 'src/app/private/dao/dao.service';
import { Observer } from 'src/app/private/models/observer.model';
import { LoaderService } from 'src/app/services/loader.service';
import { FormUtil } from 'src/app/util/util.form.service';

@Component({
  selector: 'esm-modal-add-observer',
  templateUrl: './modal-add-observer.component.html',
  styleUrls: ['./modal-add-observer.component.scss'],
})
export class ModalAddObserverComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;
  @Output() response: EventEmitter<Observer> = new EventEmitter<Observer>();

  urlObservers: string = ESPIM_REST_Observers;
  form: UntypedFormGroup = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required]),
    email: this.formBuilder.control('', [Validators.required]),
    role: this.formBuilder.control('', [Validators.required]),
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
        .postObject(this.urlObservers + '?include=user', dados)
        .pipe(finalize(() => this._loaderService.hide()))
        .subscribe(
          (resp) => {
            if (resp.error) {
              FormUtil.setErrorsBackend(this.form, resp);
            } else {
              this._toastr.success(resp.message);
              this.response.emit(new Observer(resp.data));
              this.bsModalRef.hide();
            }
          },
          (resp) => FormUtil.setErrorsBackend(this.form, resp.data, this.formElement)
        );
    }
  }
}
