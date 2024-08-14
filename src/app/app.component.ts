import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { LoginService } from 'src/app/security/login/login.service';

import { LoaderService } from './services/loader.service';

@Component({
  selector: 'esm-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  private _user$: Subscription;
  private _unsubscribe: Subscription[] = [];

  constructor(
    private translate: TranslateService,
    private _router: Router,
    private _loaderService: LoaderService,
    private readonly loginService: LoginService
  ) {
    translate.setDefaultLang('pt');
  }

  ngOnInit() {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => this._loaderService.hide());
  }

  ngOnDestroy(): void {
    if (this._user$) {
      this._user$.unsubscribe();
    }
    this._unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
