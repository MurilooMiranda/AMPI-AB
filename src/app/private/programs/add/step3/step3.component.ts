import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { ESPIM_REST_ProgramUsers } from 'src/app/app.api';
import { User } from 'src/app/private/models/user.model';
import { SearchComponent } from 'src/app/private/search/search.component';

import { DAOService } from '../../../dao/dao.service';
import { Program } from '../../../models/program.model';
import { LETRAS_FILTRO } from '../../constants';
import { ProgramsAddService } from '../programsadd.service';
import { ModalAddParticipantComponent } from './modal-add-participant/modal-add-participant.component';

@Component({
  selector: 'esm-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  @ViewChild('search') searchElement: SearchComponent;
  program: Observable<Program>; // These are the users of this program
  loading: boolean = true;
  search: Subject<string> = new Subject<string>();
  filterQuery: string = '*';
  users: User[]; // These are the general users
  programUsers: User[] = [];
  private _subscription$: Subscription;
  urlProgramUsers: string = ESPIM_REST_ProgramUsers;
  letters: string[] = LETRAS_FILTRO;
  private _modalRef: BsModalRef;

  constructor(
    private daoService: DAOService,
    private programAddService: ProgramsAddService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _modalService: BsModalService
  ) {
    this.program = this.programAddService.program;
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
        this.users = response.data;
      });
  }

  isChecked(participant: User) {
    return !!(this.programUsers ? this.programUsers.find((value) => value.id === participant.id) : undefined);
  }

  ngOnInit() {
    // Trigger first Request
    this.search.next('');

    this._subscription$ = this.programAddService.program.subscribe((programInstance: Program) => {
      this.programUsers = programInstance.users;
    });
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
    this.programAddService.saveLocalStep({ users: this.programUsers });
  }

  /**
   * Adds an participant to the programUsers
   */
  addProgramUser(participant: User) {
    this.programUsers.push(participant);
  }

  /**
   * Removes an participant from the programUsers
   */
  removeProgramUser(participant: User) {
    this.programUsers.splice(
      this.programUsers.findIndex((value: User) => value.id === participant.id),
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
    this.users = [];
    this.loading = true;
    this.search.next($event);
  }

  getUsers(): Observable<any> {
    let id = this.activeRoute.parent.snapshot.params.id;

    let searchTerm = this.searchElement.form.get('query').value;
    let params = new HttpParams()
      .set('search', searchTerm)
      .set('letter', this.filterQuery)
      .set('include', 'user')
      .set('orderBy', 'name')
      .set('sortedBy', 'asc');
    return this.daoService.getObjects(this.urlProgramUsers + (id ? id : ''), params);
  }

  sort(participants: User[]): User[] {
    return participants.sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  getName(user: User): string {
    return (user.name ? user.name : user.alias) + ' ' + (user.name && user.alias ? `(${user.alias})` : `(${user.email})`);
  }

  submit(): void {
    this.programAddService.saveStep({ users: this.programUsers.map((item) => item.id) }).subscribe(() => {});
    this.programAddService.saveLocalStep({ users: this.programUsers });

    this.router.navigate(['./fourth'], {
      relativeTo: this.activeRoute.parent,
    });
  }

  openModalParticipant(): void {
    const config: ModalOptions<ModalAddParticipantComponent> = {
      ignoreBackdropClick: true,
      initialState: {},
    };

    this._modalRef = this._modalService.show(ModalAddParticipantComponent, config);

    this._modalRef.content.response.pipe(take(1)).subscribe((participant: User) => {
      this.handleChange(participant);
      this.addProgramUser(participant);
    });
  }
}
