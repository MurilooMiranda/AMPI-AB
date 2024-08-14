import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Permissions, ESPIM_REST_Roles } from 'src/app/app.api';
import { LoaderService } from 'src/app/services/loader.service';
import { FormUtil } from 'src/app/util/util.form.service';

import { DAOService } from '../../dao/dao.service';
import { Permission } from '../../models/permission.model';

@Component({
  selector: 'esm-roles-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;

  url: string = ESPIM_REST_Roles;
  urlPermissions: string = ESPIM_REST_Permissions;
  permissions: Permission[] = [];
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
      name: this._formBuilder.control('', [Validators.required]),
      permissions: this._formBuilder.array([]),
    });

    if (this.id) {
      this.fetchData(this.id);
    } else {
      this.loading = false;
    }

    this.getPermissions();
  }

  fetchData(id: string) {
    this._loaderService.show();
    this._daoService
      .getObject(this.url, id)
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((response) => {
        this.form.patchValue({ ...response.data });
        response.data.permissions.forEach((it) => this.checkboxHandler(true, new Permission(it)));
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
              this.route.navigate(['/private/roles/list']);
            }
          },
          (resp) => FormUtil.setErrorsBackend(this.form, resp.data)
        );
    }
  }

  sendRequest(): Observable<any> {
    var dados = { ...this.form.value };
    dados.permissions = this.permissionIdArray;

    if (this.id) {
      return this._daoService.putObject(this.url + this.id, dados);
    } else {
      return this._daoService.postObject(this.url, dados);
    }
  }

  checkboxHandler(checked: boolean, permission: Permission) {
    if (checked) {
      this.permissionFormArray.push(this._formBuilder.control(permission));
    } else {
      let index = this.permissionIdArray.indexOf(permission.id);
      this.permissionFormArray.removeAt(index);
    }
  }

  get permissionIdArray() {
    return this.permissionFormArray.value.map((permission: Permission) => permission.id);
  }

  get permissionFormArray() {
    return this.form.controls.permissions as UntypedFormArray;
  }

  getPermissions(): void {
    this._daoService.getObjects(this.urlPermissions).subscribe((response) => {
      this.permissions = response.data;
    });
  }

  isChecked(permission: Permission) {
    return this.permissionFormArray.value.find((value) => value.id == permission.id) ? true : false;
  }
}
