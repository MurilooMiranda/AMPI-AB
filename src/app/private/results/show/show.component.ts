import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Results } from 'src/app/app.api';
import { LoaderService } from 'src/app/services/loader.service';
import { Helper } from 'src/app/util/helpers';

import { DAOService } from '../../dao/dao.service';
import { Program } from '../../models/program.model';
import { Trigger } from '../../models/trigger.model';

@Component({
  selector: 'esm-results-show',
  templateUrl: './show.component.html',
})
export class ShowComponent implements OnInit {
  @ViewChild('formElement') formElement: ElementRef;

  url: string = ESPIM_REST_Results;
  form: FormGroup;
  editing: boolean = false;
  loading: boolean = true;
  id: string = '';
  program: Program;

  constructor(private _daoService: DAOService, private _loaderService: LoaderService, private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params.id;

    this.fetchData(this.id);
  }

  fetchData(id: string) {
    this._loaderService.show();

    let params = new HttpParams().set(
      'include',
      'activeEventsWithResults,activeEventsWithResults.triggers,activeEventsWithResults.interventions'
    );

    this._daoService
      .getObject(this.url, id, params)
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((response) => {
        response.data.activeEventsWithResults = response.data.activeEventsWithResults.map((event) => {
          event.triggers = event.triggers.map((it) => new Trigger(it));
          event.interventions = event.interventions.map((it) => Helper.getInterventionClass(it));
          return event;
        });

        this.program = response.data;
      });
  }
}
