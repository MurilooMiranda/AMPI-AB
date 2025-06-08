import { DecimalPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs/operators';
import { ESPIM_REST_Programs, FIRST_TEXT, LAST_TEXT, NEXT_TEXT, PREV_TEXT } from 'src/app/app.api';
import { LoaderService } from 'src/app/services/loader.service';
import { SwalService } from 'src/app/services/swal.service';

import { DAOService } from '../../dao/dao.service';
import { Program } from '../../models/program.model';

@Component({
  selector: 'esm-particpants-list',
  templateUrl: './programslist.component.html',
  providers: [DecimalPipe],
})
export class ProgramsListComponent {
  firstText: string = FIRST_TEXT;
  lastText: string = LAST_TEXT;
  prevText: string = PREV_TEXT;
  nextText: string = NEXT_TEXT;

  urlPrograms: string = ESPIM_REST_Programs;
  programs: Program[];
  total: number;
  loading: boolean = true;
  page: number = 1;
  pageSize: 10;
  search: Subject<string> = new Subject<string>();
  searchTerm: string = '';

  constructor(
    private daoService: DAOService,
    private readonly _router: Router,
    private _loaderService: LoaderService,
    private readonly _swalService: SwalService,
    private _toastr: ToastrService
  ) {
    this.search
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => {
          return this.getPrograms();
        })
      )
      .subscribe((response) => {
        this.loading = false;
        this.setPrograms(response);
      });
  }

  handleChange($event: any, search: boolean = false): void {
    if (search) {
      this.total = null;
      this.searchTerm = $event;
      this.page = 1;
    }
    this.programs = [];
    this.loading = true;
    this.search.next($event);
  }

  ngOnInit() {
    this.search.next('');
  }

  getPrograms(): Observable<any> {
    let params = new HttpParams()
      .set('search', this.searchTerm)
      .set('page', this.page?.toString())
      .set('orderBy', 'created_at')
      .set('sortedBy', 'desc');
    return this.daoService.getObjects(this.urlPrograms, params);
  }

  setPrograms(response) {
    this.total = response.meta.pagination.total;
    this.pageSize = response.meta.pagination.per_page;
    this.programs = response.data;
  }

  deleteProgram(program: Program) {
    this._swalService.confirmDelete(program.title, 'Programa').then((result) => {
      if (result.isConfirmed) {
        this._loaderService.show();
        this.daoService
          .deleteObject(this.urlPrograms, program.id.toString())
          .pipe(finalize(() => this._loaderService.hide()))
          .subscribe((resp) => {
            this.handleChange(resp);
            this._toastr.success(resp.message);
          });
      }
    });
  }

  cloneProgram(program: Program) {
    this._swalService
      .warning(`Tem certeza que deseja fazer uma cópia do programa "${program.title}"`, 'Fazer cópia do programa')
      .then((result) => {
        if (result.isConfirmed) {
          this._loaderService.show();
          this.daoService
            .postObject(this.urlPrograms + program.id + '/copy', {})
            .pipe(finalize(() => this._loaderService.hide()))
            .subscribe((resp) => {
              this._router.navigate([`/private/programs/edit/${resp.data.id}`]);
              this._toastr.success(resp.message);
            });
        }
      });
  }
}
