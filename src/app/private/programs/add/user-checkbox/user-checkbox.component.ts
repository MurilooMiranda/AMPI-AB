import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/private/models/user.model';
import { v4 as uuid } from 'uuid';

import { Observer } from '../../../models/observer.model';

// This component is used on step2 & step3

@Component({
  selector: 'esm-user-checkbox',
  templateUrl: './user-checkbox.component.html',
})
export class UserCheckBoxComponent implements OnInit {
  @Input() user: Observer | User;
  @Input() label: string;
  @Input() checked: boolean;
  @Input() disabled: boolean;
  uid: string = uuid();

  @Output() removeUser = new EventEmitter<Observer | User>();
  @Output() addUser = new EventEmitter<Observer | User>();

  constructor() {}

  ngOnInit() {}

  checkboxHandler(checked: boolean) {
    if (checked) this.addUser.emit(this.user);
    else this.removeUser.emit(this.user);
  }
}
