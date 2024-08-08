/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { LoaderService } from '../services/loader.service';
import { isNullOrUndefined } from '../util/functions';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuard  {
  urlSignup: string = '/security/signup';
  constructor(private readonly _router: Router, private loginService: LoginService, private _loaderService: LoaderService) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loginService.isLoggedIn()) {
      return true;
    }

    this.loginService.logout();
    this._router.navigate(['/']);
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuthentication(state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuthentication(state);
  }

  checkAuthentication(state: RouterStateSnapshot): Observable<boolean> {
    const user = this.loginService.userValue;
    let loggedIn = this.loginService.isLoggedIn();

    if (!loggedIn) {
      this.loginService.logout();
    }

    if (loggedIn && (!user || !user.email)) {
      this._loaderService.show();
      return this.loginService.fetchUser().pipe(
        map((user) => {
          if (state.url != this.urlSignup && isNullOrUndefined(this.loginService.userObserver)) {
            this._router.navigate([this.urlSignup]);
            return false;
          }
          return true;
        }),
        catchError(() => {
          this.loginService.logout();
          return of(false);
        }),
        finalize(() => this._loaderService.hide())
      );
    }

    if (state.url != this.urlSignup && isNullOrUndefined(this.loginService.userObserver)) {
      this._router.navigate([this.urlSignup]);
      loggedIn = false;
    }

    return of(loggedIn);
  }
}
