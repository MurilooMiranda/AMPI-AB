import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './login.service';

@Component({
  selector: 'esm-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  constructor(private _loginService: LoginService, private router: Router) {}

  ngOnInit() {}

  login() {
    if (this._loginService.isLoggedIn()) {
      this.router.navigate(['/private']);
    } else {
      this._loginService.loginWithGoogle();
    }
  }

  logout() {
    this._loginService.logout();
  }
}
