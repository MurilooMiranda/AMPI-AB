import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/private/models/user.model';
import { LoginService } from 'src/app/security/login/login.service';

@Component({
  selector: 'esm-security-header',
  templateUrl: './header.component.html',
})
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
