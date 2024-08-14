import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { ESPIM_REST_Observers } from 'src/app/app.api';
import { Program } from 'src/app/private/models/program.model';
import { SearchComponent } from 'src/app/private/search/search.component';

import { LoginService } from '../../../../security/login/login.service';
import { DAOService } from '../../../dao/dao.service';
import { Observer } from '../../../models/observer.model';
import { LETRAS_FILTRO } from '../../constants';
import { ProgramsAddService } from '../programsadd.service';
import { ModalAddObserverComponent } from './modal-add-observer/modal-add-observer.component';

@Component({
  selector: 'esm-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit, OnDestroy {
  @ViewChild('search') searchElement: SearchComponent;

  program: Observable<Program>; // These are the observers of this program
  loading: boolean = true;
  search: Subject<string> = new Subject<string>();
  filterQuery: string = '*';
  observers: Observer[]; // These are the general observers
  programObservers: Observer[] = [];
  urlObservers: string = ESPIM_REST_Observers;
  letters: string[] = LETRAS_FILTRO;

  private _modalRef: BsModalRef;
  private _subscription$: Subscription;

  constructor(
    private daoService: DAOService,
    private programAddService: ProgramsAddService,
    private router: Router,
    private _route: ActivatedRoute,
    private loginService: LoginService,
    private _modalService: BsModalService
  ) {
    this.program = this.programAddService.program;
    this.search
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => {
          return this.getObservers();
        })
      )
      .subscribe((response) => {
        this.loading = false;
        this.observers = response.data;
      });
  }

  isChecked(observer: Observer) {
    return !!(this.programObservers ? this.programObservers.find((value) => value.id === observer.id) : undefined);
  }

  isDisabled(observer: Observer) {
    return observer.id === this.loginService.userValue.id;
  }

  ngOnInit() {
    // Trigger first Request
    this.search.next('');

    this._subscription$ = this.programAddService.program.subscribe((programInstance: Program) => {
      this.programObservers = programInstance.observers;
    });
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
    this.programAddService.saveLocalStep({ observers: this.programObservers });
  }

  /**
   * Adds an observer to the programObservers
   */
  addProgramObserver(observer: Observer) {
    this.programObservers.push(observer);
  }

  /**
   * Removes an observer from the programObservers
   */
  removeProgramObserver(observer: Observer) {
    this.programObservers.splice(
      this.programObservers.findIndex((value: Observer) => value.id === observer.id),
      1
    );
  }

  filter_by(letter: string) {
    if (letter !== this.filterQuery) {
      this.filterQuery = letter;
      this.searchElement.form.get('query').setValue('');
      this.handleChange(letter);
    }
  }

  // Search
  // Filter by Letter
  handleChange($event: any, search: boolean = false): void {
    this.observers = [];
    this.loading = true;
    this.search.next($event);
  }

  getObservers(): Observable<any> {
    let searchTerm = this.searchElement.form.get('query').value;
    let params = new HttpParams()
      .set('search', searchTerm)
      .set('letter', this.filterQuery)
      .set('orderBy', 'users|name')
      .set('include', 'user')
      .set('sortedBy', 'asc');
    return this.daoService.getObjects(this.urlObservers, params);
  }

  sort(observers: Observer[]): Observer[] {
    return observers.sort((a, b) => (a.user.name.toLowerCase() > b.user.name.toLowerCase() ? 1 : -1));
  }

  submit(): void {
    this.programAddService.saveStep({ observers: this.programObservers.map((item) => item.id) }).subscribe(() => {});
    this.programAddService.saveLocalStep({ observers: this.programObservers });

    this.router.navigate(['./third'], {
      relativeTo: this._route.parent,
    });
  }

  openModalObserver(): void {
    const config: ModalOptions<ModalAddObserverComponent> = {
      ignoreBackdropClick: true,
      initialState: {},
    };

    this._modalRef = this._modalService.show(ModalAddObserverComponent, config);

    this._modalRef.content.response.pipe(take(1)).subscribe((observer: Observer) => {
      this.handleChange(observer);
      this.addProgramObserver(observer);
    });
  }
}
