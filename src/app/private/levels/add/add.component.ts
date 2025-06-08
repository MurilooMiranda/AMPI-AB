import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Levels } from 'src/app/app.api';
import { LoaderService } from 'src/app/services/loader.service';
import { FormUtil } from 'src/app/util/util.form.service';

import { DAOService } from '../../dao/dao.service';

@Component({
  selector: 'esm-levels-add',
  templateUrl: './add.component.html',
})
export class LevelsAddComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;

  url: string = ESPIM_REST_Levels;
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
      min_points: this._formBuilder.control('', [Validators.required, Validators.min(0), Validators.max(9999)]),
      max_points: this._formBuilder.control('', [Validators.required, Validators.min(0), Validators.max(9999)]),
    });

    if (this.id) {
      this.fetchData(this.id);
    } else {
      this.loading = false;
    }
  }

  fetchData(id: string) {
    this._loaderService.show();
    this._daoService
      .getObject(this.url, id)
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((response) => {
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
              this.route.navigate(['/private/levels/list']);
            }
          },
          (resp) => FormUtil.setErrorsBackend(this.form, resp.data)
        );
    }
  }

  sendRequest(): Observable<any> {
    var dados = { ...this.form.value };

    if (this.id) {
      return this._daoService.putObject(this.url + this.id, dados);
    } else {
      return this._daoService.postObject(this.url, dados);
    }
  }
}
