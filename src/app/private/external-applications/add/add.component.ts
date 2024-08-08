import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_ExternalApplications } from 'src/app/app.api';
import { LoaderService } from 'src/app/services/loader.service';
import { FormUtil } from 'src/app/util/util.form.service';

import { DAOService } from '../../dao/dao.service';
import { ExternalApplicationParameter } from '../../models/external-application.model';
import { ParameterComponent } from '../parameter/parameter.component';

@Component({
  selector: 'esm-external-applications-add',
  templateUrl: './add.component.html',
})
export class ExternalApplicationAddComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;
  @ViewChildren(ParameterComponent) parameterComponents: ParameterComponent[];

  urlExternalApplications: string = ESPIM_REST_ExternalApplications;
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
      package: this._formBuilder.control('', [Validators.required]),
      parameters: this._formBuilder.array([]),
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
      .getObject(this.urlExternalApplications, id)
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((response) => {
        this.form.patchValue({ ...response.data });
        response.data.parameters.forEach((param) => {
          this.adicionarParametro(param);
        });
      });
  }

  novoParametro() {
    this.adicionarParametro(new ExternalApplicationParameter());
  }

  adicionarParametro(value: ExternalApplicationParameter): void {
    this.parametersFormArray.push(this._formBuilder.control(value));
  }

  removerParametro(index: number): void {
    this.parametersFormArray.removeAt(index);
  }

  get parametersFormArray(): UntypedFormArray {
    return this.form.get('parameters') as UntypedFormArray;
  }

  save(event) {
    this.form.markAllAsTouched();
    let valid = true;

    this.parameterComponents.forEach((component) => {
      if (!component.validateForm()) {
        valid = false;
      }
    });

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
              this.route.navigate(['/private/external-applications/list']);
            }
          },
          (resp) => FormUtil.setErrorsBackend(this.form, resp.data)
        );
    }
  }

  sendRequest(): Observable<any> {
    var dados = { ...this.form.value };

    if (this.id) {
      return this._daoService.putObject(this.urlExternalApplications + this.id, dados);
    } else {
      return this._daoService.postObject(this.urlExternalApplications, dados);
    }
  }
}
