import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SwalService } from '../services/swal.service';
import { LoginService } from './../security/login/login.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private readonly _authenticationService: LoginService,
    private readonly _router: Router,
    private readonly _swalService: SwalService,
    private readonly _toastr: ToastrService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Blob && error.error.type.includes('json')) {
          const promise = new Promise((resolve, reject) => {
            try {
              resolve(
                error.error.text().then((v) => {
                  return this._handleError(req.url, new HttpErrorResponse({ ...error, error: JSON.parse(v) }));
                })
              );
            } catch {
              reject(this._handleError(req.url, error));
            }
          });
          return from(promise as Promise<never>);
        } else {
          return this._handleError(req.url, error);
        }
      })
    );
  }

  private _handleError(url: string, error: any): Observable<never> {
    const objError = {
      unauthorized: error.status === 401 || error.status === 403,
      code: error.status,
      message: error.message,
      data: error.error,
    };

    if (error.status === 401) {
      this._authenticationService.clearStorage();
      if (!url.startsWith('/')) {
        this._router.navigate(['/']);
      }
      return throwError(objError);
    }

    if (error.status === 403) {
      this._toastr.warning(this._getMessage(error), this._getTitle(error));
      return throwError(objError);
    } else if (error.status === 301 || error.status === 302) {
      const urlRedirect = error.headers.get('Content-Location') || error.headers.get('Location') || error.headers.get('url');

      if (urlRedirect) {
        window.open(urlRedirect, '_blank');
        return EMPTY;
      }
    }

    if (error.status === 422) {
      this._swalService.showFormErrors(this._getTitle(error), error.error.errors);
    } else {
      this._toastr.error(this._getMessage(error), this._getTitle(error));
    }
    return throwError(objError);
  }

  private _getMessage(error: HttpErrorResponse): string {
    if (error.error && error.error.message && (!environment.production || (environment.production && error.status < 500))) {
      if (error.error.message instanceof Object) {
        return 'Existem campos inválidos no formulário';
      }
      return error.error.message;
    }

    let message: string;
    switch (error.status) {
      case 400:
        return `Ocorreu um erro no endereço solicitado, pode ser que algum parâmetro esteja inválido.
                Por favor, verifique e tente novamente`;
      case 403:
        message = `Você não tem permissão para realizar esta operação
                  ou visualizar a página solicitada.`;
        break;
      case 404:
        message = 'Endereço não encontrado ou não disponível no servidor';
        break;
      case 405:
        message = `Solicitação utilizando um tipo de requisição não permitido
                  para o endereço solicitado.`;
        break;
      case 412:
      case 422:
        message = 'Existem alguns erros, favor verificar os dados fornecidos.';
        break;
      case 500:
      case 503:
      case 504:
        message = 'Por favor, tente novamente mais tarde.';
        break;
      default:
        message = error.message;
    }

    if (environment.production) {
      message += `<br />
        Caso o problema persista,
        entre em contato com o suporte técnico`;
    }

    return message;
  }

  private _getTitle(error: HttpErrorResponse): string {
    if (error.error && error.error.title_message) {
      return error.error.title_message;
    } else {
      switch (error.status) {
        case 400:
        case 410:
          return '';
        case 403:
        case 405:
          return 'Acesso Negado!';
        case 412:
        case 422:
          return 'Parâmetros inválidos!';
        default:
          return `Falha na comunicação com o servidor`;
      }
    }
  }
}
