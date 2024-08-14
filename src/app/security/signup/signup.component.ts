import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Observers } from 'src/app/app.api';
import { DAOService } from 'src/app/private/dao/dao.service';
import { User } from 'src/app/private/models/user.model';
import { LoginService } from 'src/app/security/login/login.service';
import { LoaderService } from 'src/app/services/loader.service';
import { isNullOrUndefined } from 'src/app/util/functions';
import { FormUtil } from 'src/app/util/util.form.service';

@Component({
  selector: 'esm-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;

  urlObservers: string = ESPIM_REST_Observers;
  form: UntypedFormGroup = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required]),
    email: this.formBuilder.control('', [Validators.required]),
    role: this.formBuilder.control('', [Validators.required]),
  });
  user$: Observable<User>;

  constructor(
    private _loginService: LoginService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private _toastr: ToastrService,
    private _loaderService: LoaderService,
    private _daoService: DAOService
  ) {
    // // Carrega os parametros da rota nos valores do formulário
    this.form.patchValue(this._loginService.userValue);

    if (!isNullOrUndefined(this._loginService.userObserver)) {
      this.router.navigate(['/private']);
    }
  }

  ngOnInit() {
    this.user$ = this._loginService.user;
  }

  save() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      var dados = { ...this.form.value };
      this._loaderService.show();

      this._daoService
        .postObject(this.urlObservers + 'createAuth?include=user,observer.user', dados)
        .pipe(finalize(() => this._loaderService.hide()))
        .subscribe(
          (resp) => {
            this._toastr.success('Dados registrados com sucesso!');
            this._loginService.handleAuth(resp);
          },
          (resp) => FormUtil.setErrorsBackend(this.form, resp.data, this.formElement)
        );
    }
  }
}
