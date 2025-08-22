import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { forkJoin } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ESPIM_REST_Results, ESPIM_REST_RESULTS_AMPI_AB } from 'src/app/app.api';
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
  users: User[];
  results: SessionResult[];

  constructor(
    private readonly _loaderService: LoaderService,
    private readonly _daoService: DAOService,
    private activeRoute: ActivatedRoute
  ) { }

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

    const endpointBase = this.urlResults + 1383 + '/events/' + 3617;

    const compiledResults: {

      [userId: number]: {

        sessions: SessionResult[],

        answers: { [question: string]: string | null }

      }

    } = {};

    this._daoService.getObjects(endpointBase, { user: null }).subscribe((initialResponse) => {

      console.log('✅ Chamada inicial com user=null', initialResponse);



      const completedUserIds = new Set<number>();



      initialResponse.data.forEach((entry: any) => {

        const userId = entry.user?.id;

        const endedAt = entry.ended_at;



        if (userId && endedAt !== null) {

          completedUserIds.add(userId);

        }

      });

      const requests = Array.from(completedUserIds).map((userId) => {

        return this._daoService.getObjects(endpointBase, { user: userId }).pipe(

          map((response: any) => ({ userId, data: response.data }))

        );

      });

      if (requests.length === 0) {

        this.loadingGraphs = false;

        console.warn('⚠️ Nenhum usuário com ended_at preenchido.');

        return;

      }

      forkJoin(requests)

        .pipe(finalize(() => (this.loadingGraphs = false)))

        .subscribe((userResponses) => {

          userResponses.forEach(({ userId, data }) => {

            const sessionResults = data.map((r: any) => new SessionResult(r));

            const answers: { [question: string]: string | null } = {};

            // Percorre cada sessão e cada resposta
            data.forEach((session: any) => {

              session.results?.forEach((result: any) => {

                const statement = result.intervention?.statement?.trim();

                const answer = result.answer;

                if (statement && !(statement in answers)) {

                  answers[statement] = answer;

                }

              });

            });
            compiledResults[userId] = {

              sessions: sessionResults,

              answers

            };
          });
          console.log('📊 Resultados finais compilados:', compiledResults);
        });
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
