import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Settings } from 'src/app/app.api';
import { LoginService } from 'src/app/security/login/login.service';
import { LoaderService } from 'src/app/services/loader.service';
import { FormUtil } from 'src/app/util/util.form.service';

import { DAOService } from '../../dao/dao.service';

@Component({
  selector: 'esm-settings-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;

  url: string = ESPIM_REST_Settings;
  form: FormGroup;
  editing: boolean = false;
  loading: boolean = true;
  id: string = '';

  constructor(
    private _daoService: DAOService,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private _loaderService: LoaderService,
    private _loginService: LoginService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params.id;

    this.form = this._formBuilder.group({
      name: this._formBuilder.control(null, [Validators.required]),
      email: this._formBuilder.control(null, [Validators.required]),
      role: this._formBuilder.control(null, [Validators.required]),
    });

    this.fetchData();
  }

  fetchData() {
    this._loaderService.show();
    let params = new HttpParams().set('include', 'observer');

    this._daoService
      .getObjects(this.url, params)
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((response) => {
        response.data.role = response.data.observer.role;
        this.form.patchValue({ ...response.data });
      });
  }

  save(event) {
    this.form.markAllAsTouched();
    let valid = true;

    if (this.form.valid && valid) {
      this._loaderService.show();

      this.sendRequest()
        .pipe(finalize(() => this._loaderService.hide()))
        .subscribe(
          (response) => {
            if (response.error) {
              FormUtil.setErrorsBackend(this.form, response);
            } else {
              this._toastr.success(response.message);
              this._loginService.handleFetchUser(response);
            }
          },
          (resp) => FormUtil.setErrorsBackend(this.form, resp.data)
        );
    }
  }

  sendRequest(): Observable<any> {
    var dados = { ...this.form.value };

    return this._daoService.putObject(this.url + '?include=observer', dados);
  }
}
