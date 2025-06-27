import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { isBoolean } from '../util/functions';
import { LoginService } from './login/login.service';

type ReturnGuard = Observable<boolean> | Promise<boolean> | boolean;
@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard  {
  routeURL: string = '/private';

  constructor(
    private readonly _ngxPermissionsGuard: NgxPermissionsGuard,
    private readonly _loginService: LoginService,
    private readonly _toastr: ToastrService,
    private readonly _router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): ReturnGuard {
    return this._checkPermission(this._ngxPermissionsGuard.canActivate(next, state));
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): ReturnGuard {
    return this._checkPermission(this._ngxPermissionsGuard.canActivateChild(next, state));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canLoad(route: Route, segments: UrlSegment[]): ReturnGuard {
    return this._checkPermission(this._ngxPermissionsGuard.canLoad(route));
  }

  private _checkPermission(loaded: ReturnGuard): ReturnGuard {
    if (!this._loginService.isLoggedIn()) {
      return false;
    }

    if (isBoolean(loaded)) {
      if (!loaded) {
        this._showDenyMessage();
        return false;
      }
      return true;
    }

    return (loaded as Promise<boolean>)
      .then((load) => {
        if (!load) {
          this._showDenyMessage();
          return false;
        }
        return true;
      })
      .catch(() => {
        this._showDenyMessage();
        return false;
      });
  }

  private _showDenyMessage(): void {
    this._toastr.warning('Você não tem permissão para acessar esta página.', 'Acesso Negado!');
    this._router.navigate([this.routeURL]);
  }
}
