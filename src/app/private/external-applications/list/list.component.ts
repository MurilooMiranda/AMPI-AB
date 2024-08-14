import { DecimalPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs/operators';
import { ESPIM_REST_ExternalApplications } from 'src/app/app.api';
import { LoaderService } from 'src/app/services/loader.service';
import { SwalService } from 'src/app/services/swal.service';

import { DAOService } from '../../dao/dao.service';
import { ExternalApplication } from '../../models/external-application.model';

@Component({
  selector: 'esm-external-application-list',
  templateUrl: './list.component.html',
  providers: [DecimalPipe],
})
export class ExternalApplicationListComponent {
  urlExternalApplications: string = ESPIM_REST_ExternalApplications;
  externalApplications: ExternalApplication[];
  total: number;
  loading: boolean = true;
  page: number = 1;
  pageSize: 10;
  search: Subject<string> = new Subject<string>();
  searchTerm: string = '';
  private _modalRef: BsModalRef;

  constructor(
    private daoService: DAOService,
    private readonly _modalService: BsModalService,
    private _loaderService: LoaderService,
    private readonly _swalService: SwalService,
    private _toastr: ToastrService
  ) {
    this.search
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => {
          return this.getExternalApplications();
        })
      )
      .subscribe((response) => {
        this.loading = false;
        this.setExternalApplications(response);
      });
  }

  handleChange($event: any, search: boolean = false): void {
    if (search) {
      this.total = null;
      this.searchTerm = $event;
      this.page = 1;
    }
    this.externalApplications = [];
    this.loading = true;
    this.search.next($event);
  }

  ngOnInit() {
    this.search.next('');
  }

  getExternalApplications(): Observable<any> {
    let params = new HttpParams()
      .set('search', this.searchTerm)
      .set('page', this.page?.toString())
      .set('orderBy', 'created_at')
      .set('sortedBy', 'desc');
    return this.daoService.getObjects(this.urlExternalApplications, params);
  }

  setExternalApplications(response) {
    this.externalApplications = response.data;
    this.total = response.meta.pagination.total;
    this.pageSize = response.meta.pagination.per_page;
  }

  deleteExternalApp(externalApp: ExternalApplication) {
    this._swalService.confirmDelete(externalApp.name + '-' + externalApp.package, 'Aplicação Externa').then((result) => {
      if (result.isConfirmed) {
        this._loaderService.show();
        this.daoService
          .deleteObject(this.urlExternalApplications, externalApp.id.toString())
          .pipe(finalize(() => this._loaderService.hide()))
          .subscribe((resp) => {
            this.handleChange(resp);
            this._toastr.success(resp.message);
          });
      }
    });
  }
}
