import { DecimalPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ESPIM_REST_Users } from 'src/app/app.api';

import { DAOService } from '../../dao/dao.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'esm-users-list',
  templateUrl: './list.component.html',
  providers: [DecimalPipe],
})
export class ListComponent {
  url: string = ESPIM_REST_Users;
  users: User[];
  total: number;
  loading: boolean = true;
  page: number = 1;
  pageSize: 10;
  search: Subject<string> = new Subject<string>();
  searchTerm: string = '';

  constructor(private daoService: DAOService) {
    this.search
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => {
          return this.getUsers();
        })
      )
      .subscribe((response) => {
        this.loading = false;
        this.setUsers(response);
      });
  }

  handleChange($event: any, search: boolean = false): void {
    if (search) {
      this.total = null;
      this.searchTerm = $event;
      this.page = 1;
    }
    this.users = [];
    this.loading = true;
    this.search.next($event);
  }

  ngOnInit() {
    this.search.next('');
  }

  getUsers(): Observable<any> {
    let params = new HttpParams()
      .set('search', this.searchTerm)
      .set('page', this.page?.toString())
      .set('orderBy', 'created_at')
      .set('sortedBy', 'desc');

    return this.daoService.getObjects(this.url, params);
  }

  setUsers(response) {
    this.users = response.data;
    this.total = response.meta.pagination.total;
    this.pageSize = response.meta.pagination.per_page;
  }
}
