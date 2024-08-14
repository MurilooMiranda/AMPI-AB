import { Component, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';

import { Program } from '../../../models/program.model';
import { ProgramsAddService } from '../programsadd.service';

@Component({
  selector: 'esm-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnDestroy {
  program: Observable<Program>;
  form: UntypedFormGroup;
  bsConfig: any = { dateInputFormat: 'DD/MM/YYYY' };
  private _subscription$: Subscription;

  constructor(
    private programAddService: ProgramsAddService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private _route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      isPublic: [false],
      beginDate: [''],
      beginTime: [''],
      endDate: [''],
      endTime: [''],
    });

    this.program = this.programAddService.program;

    this._subscription$ = this.programAddService.program.subscribe((programInstance: Program) => {
      this.setProgram(programInstance);
    });
  }

  ngOnDestroy(): void {
    this._subscription$.unsubscribe();
    this.programAddService.saveLocalStep(this.form.value);
  }

  setProgram(program: Program) {
    this.form.reset();

    if (program['starts']) {
      program['beginDate'] = moment(program['starts']).format('DD/MM/YYYY');
      program['beginTime'] = program['starts'];
    }

    if (program['ends']) {
      program['endDate'] = moment(program['ends']).format('DD/MM/YYYY');
      program['endTime'] = program['ends'];
    }
    this.form.patchValue({ ...program });
  }

  toDate(date: Date, time?: Date): string {
    if (!date || !moment(date).isValid()) {
      return null;
    }

    let dateFormated = moment(date).format('YYYY-MM-DD');
    if (!time) {
      return dateFormated;
    }
    return `${dateFormated} ${moment(time).format('HH:mm:ss')}`;
  }

  submit(): void {
    this.form.markAllAsTouched();

    let dados = { ...this.form.value };

    dados['starts'] = this.toDate(dados['beginDate'], dados['beginTime']);
    dados['ends'] = this.toDate(dados['endDate'], dados['endTime']);

    if (this.form.valid) {
      this.programAddService.saveStep(dados).subscribe(() => {});
      this.programAddService.saveLocalStep(dados);

      this.router.navigate(['./second'], {
        relativeTo: this._route.parent,
      });
    }
  }
}
