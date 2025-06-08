import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ESPIM_REST_Results, FIRST_TEXT, LAST_TEXT, NEXT_TEXT, PREV_TEXT } from 'src/app/app.api';

import { DAOService } from '../../dao/dao.service';
import { Program } from '../../models/program.model';

@Component({
  selector: 'esm-results-list',
  templateUrl: './list.component.html',
})
export class ListComponent {
  firstText: string = FIRST_TEXT;
  lastText: string = LAST_TEXT;
  prevText: string = PREV_TEXT;
  nextText: string = NEXT_TEXT;

  url: string = ESPIM_REST_Results;
  results: Program[];
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
          return this.getResults();
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
    this.results = [];
    this.loading = true;
    this.search.next($event);
  }

  ngOnInit() {
    this.search.next('');
  }

  getResults(): Observable<any> {
    let params = new HttpParams()
      .set('search', this.searchTerm)
      .set('page', this.page?.toString())
      .set('orderBy', 'created_at')
      .set('sortedBy', 'desc');

    return this.daoService.getObjects(this.url, params);
  }

  setUsers(response) {
    this.results = response.data;
    this.total = response.meta.pagination.total;
    this.pageSize = response.meta.pagination.per_page;
  }
}
