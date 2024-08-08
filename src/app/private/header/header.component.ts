import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/security/login/login.service';

import { User } from '../models/user.model';

export class HeaderComponent implements OnInit {
  constructor(private _loginService: LoginService) {}

  user$: Observable<User>;

  ngOnInit() {
    this.user$ = this._loginService.user;
  }

  logout() {
    this._loginService.logout();
  }
}
