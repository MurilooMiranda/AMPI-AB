import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from 'src/app/services/loader.service';

import { ESPIM_REST_Programs } from '../../../app.api';
import { LoginService } from '../../../security/login/login.service';
import { DAOService } from '../../dao/dao.service';
import { Program } from '../../models/program.model';
import { InterventionService } from './step4/intervention/intervention.service';

@Injectable({
  providedIn: 'root',
})
export class ProgramsAddService {
  urlPrograms: string = ESPIM_REST_Programs;
  private _currentProgramSubject: BehaviorSubject<Program>;
  program: Observable<Program>;

  constructor(
    private _daoService: DAOService,
    private loginService: LoginService,
    private _loaderService: LoaderService,
    private route: Router,
    private _toastr: ToastrService,
    private readonly interventionService: InterventionService
  ) {
    this._currentProgramSubject = new BehaviorSubject<Program>(new Program());
    this.program = this._currentProgramSubject.asObservable();
  }

  fetchData(id: string) {
    this._loaderService.show();
    let params = new HttpParams()
      .append('include[]', 'passiveEvents')
      .append('include[]', 'passiveEvents.sensors')
      .append('include[]', 'passiveEvents.triggers')
      .append('include[]', 'activeEvents')
      .append('include[]', 'activeEvents.interventions')
      .append('include[]', 'activeEvents.triggers')
      .append('include[]', 'users')
      .append('include[]', 'observers.user');

    this._daoService
      .getObject(this.urlPrograms, id, params)
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((response) => {
        response.data.activeEvents.map((activeEvent) => {
          activeEvent.interventions = activeEvent.interventions.map((intervention) =>
            this.interventionService.getInterventionClass(intervention)
          );

          activeEvent.interventions = this.interventionService.fixOrderAndNextForOldSPIMInterventions(activeEvent.interventions);

          return activeEvent;
        });

        this._currentProgramSubject.next(response.data);
      });
  }

  clearData() {
    let program = new Program();
    program.observers = [this.loginService.userObserver];
    this._currentProgramSubject.next(program);
  }

  /**
   * Saves an step patching "programs". Patching results in updating the attributes specified in programs
   */
  saveStep(dados: any): Observable<any> {
    let id = this.programValue.id;
    if (id) {
      // let programUpdated = { ...this.programValue, ...dados } as unknown as Program;
      this._loaderService.show();

      return this._daoService
        .patchObject(ESPIM_REST_Programs, { ...dados, ...{ id: id } })
        .pipe(finalize(() => this._loaderService.hide()));
    } else {
      return of(false);
    }
  }

  saveLocalStep(dados: any) {
    let programUpdated = { ...this.programValue, ...dados } as unknown as Program;
    this._currentProgramSubject.next(programUpdated);
  }

  /**
   * Saves an step patching "programs". Patching results in updating the attributes specified in programs
   */
  saveProgram() {
    let id = this.programValue.id;
    let program = cloneDeep(this.programValue);

    program.observers = program.observers.map((item) => item.id);
    program.users = program.users.map((item) => item.id);

    // Converte o cron para string
    // Converte conditions,scales,options para string
    program.activeEvents.map((item) => {
      item.triggers.map((trigger) => {
        trigger.condition = trigger.condition.toString();
        return trigger;
      });

      item.interventions = this.fixInterventionsToSave(item.interventions);

      if (item.gamificationConditions) {
        item.gamificationConditions.badges = item.gamificationConditions.badges.map((badge) => {
          return this.fixGamificationBadgeToSave(badge);
        });
      }

      return item;
    });

    // Converte o cron para string
    // Converte conditions
    program.passiveEvents.map((item) => {
      item.triggers.map((trigger) => {
        trigger.condition = trigger.condition.toString();
        return trigger;
      });
      return item;
    });

    this._loaderService.show();

    if (id) {
      this._daoService
        .putObject(ESPIM_REST_Programs + id, program)
        .pipe(finalize(() => this._loaderService.hide()))
        .subscribe((resp) => {
          this.route.navigate(['/private/programs/list']);
          this._toastr.success(resp.message);
        });
    } else {
      this._daoService
        .postObject(ESPIM_REST_Programs, program)
        .pipe(finalize(() => this._loaderService.hide()))
        .subscribe((resp) => {
          this.route.navigate(['/private/programs/list']);
          this._toastr.success(resp.message);
        });
    }
  }

  fixInterventionsToSave(interventions) {
    interventions.map((intervention) => {
      intervention.medias = intervention.medias.map((i) => i.id);
    });

    return interventions;
  }

  fixGamificationBadgeToSave(badge) {
    return {
      id: badge.id,
      name: badge.name,
      media_id: badge.media.id,
    };
  }

  public get programValue(): Program {
    return this._currentProgramSubject.value;
  }
}
