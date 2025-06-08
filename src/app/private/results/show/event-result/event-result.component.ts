import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Results } from 'src/app/app.api';
import { DAOService } from 'src/app/private/dao/dao.service';
import { ActiveEvent } from 'src/app/private/models/event.model';
import { SessionResult } from 'src/app/private/models/result.model';
import { User } from 'src/app/private/models/user.model';
import { LoaderService } from 'src/app/services/loader.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'esm-event-result',
  templateUrl: './event-result.component.html',
  styleUrls: ['./event-result.component.scss'],
})
export class EventResultComponent implements OnInit {
  @Input() event: ActiveEvent;
  @ViewChild('container') container: ElementRef;

  urlResults: string = ESPIM_REST_Results;
  isOpen: boolean = false;
  id: string = '';
  loadingUsers: boolean = false;
  loadingGraphs: boolean = false;
  pessoaSelecionada: string = null;
  users: User[]; // These are the general users
  results: SessionResult[];

  constructor(
    private readonly _loaderService: LoaderService,
    private readonly _daoService: DAOService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params.id;
  }

  loadDetail(open: boolean) {
    this.isOpen = open;
    this.results = [];

    if (open) {
      this.loadingUsers = true;

      this._daoService
        .getObjects(this.urlResults + this.id + '/events/' + this.event.id + '/users')
        .pipe(finalize(() => (this.loadingUsers = false)))
        .subscribe((response) => {
          this.users = response.data.map((user) => new User(user));
          this.loadGraphs();
        });
    }
  }

  loadGraphs() {
    this.loadingGraphs = true;
    this.results = [];

    this._daoService
      .getObjects(this.urlResults + this.id + '/events/' + this.event.id, { user: this.pessoaSelecionada })
      .pipe(finalize(() => (this.loadingGraphs = false)))
      .subscribe((response) => {
        this.results = response.data.map((result) => new SessionResult(result));
      });
  }

  loadUser(userId: number) {
    this.pessoaSelecionada = userId.toString();
    this.loadGraphs();
    this.scroll();
  }

  scroll() {
    window.scrollTo(0, this.container.nativeElement.offsetTop);
  }
}
