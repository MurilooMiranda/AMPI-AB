import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Roles, ESPIM_REST_Users } from 'src/app/app.api';
import { LoaderService } from 'src/app/services/loader.service';
import { FormUtil } from 'src/app/util/util.form.service';

import { DAOService } from '../../dao/dao.service';
import { Role } from '../../models/role.model';

export class AddComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;

  url: string = ESPIM_REST_Users;
  urlRoles: string = ESPIM_REST_Roles;
  roles: Role[] = [];
  form: UntypedFormGroup;
  editing: boolean = false;
  loading: boolean = true;
  id: string = '';

  constructor(
    private _daoService: DAOService,
    private _toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder,
    private _loaderService: LoaderService,
    private route: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params.id;

    this.form = this._formBuilder.group({
      name: this._formBuilder.control(null, [Validators.required]),
      email: this._formBuilder.control(null, [Validators.required]),
      roles: this._formBuilder.control([], [Validators.required]),
    });

    this.fetchData(this.id);

    this.getUsers();
  }

  fetchData(id: string) {
    this._loaderService.show();

    let params = new HttpParams().set('include', 'roles');

    this._daoService
      .getObject(this.url, id, params)
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((response) => {
        response.data.roles = response.data.roles.map((role) => role.id);
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
              this.route.navigate(['/private/users/list']);
            }
          },
          (resp) => FormUtil.setErrorsBackend(this.form, resp.data)
        );
    }
  }

  sendRequest(): Observable<any> {
    var dados = { ...this.form.value };

    return this._daoService.putObject(this.url + this.id, dados);
  }

  getUsers(): void {
    this._daoService.getObjects(this.urlRoles).subscribe((response) => {
      this.roles = response.data;
    });
  }
}
