import { Component, OnInit, ViewChildren } from '@angular/core';
import { ESPIM_REST_Programs } from 'src/app/app.api';
import { SwalService } from 'src/app/services/swal.service';
import { isNullOrUndefined } from 'src/app/util/functions';

import { ActiveEvent, Event } from '../../../models/event.model';
import { Program } from '../../../models/program.model';
import { ProgramsAddService } from '../programsadd.service';
import { ActiveEventComponent } from './active-event/active-event.component';
import { PassiveEventComponent } from './passive-event/passive-event.component';

@Component({
  selector: 'esm-step4',
  styleUrls: ['./step4.component.scss'],
  templateUrl: './step4.component.html',
})
export class Step4Component implements OnInit {
  @ViewChildren(PassiveEventComponent) passiveEventsComponents: PassiveEventComponent[];
  @ViewChildren(ActiveEventComponent) activeEventsComponents: ActiveEventComponent[];

  passiveEvents: Array<Event>;
  activeEvents: Array<Event>;
  urlPrograms: string = ESPIM_REST_Programs;

  constructor(private programAddService: ProgramsAddService, private _swalService: SwalService) {}

  trackByFn(index, item) {
    return index;
  }

  ngOnInit() {
    this.programAddService.program.subscribe((programInstance: Program) => {
      this.passiveEvents = programInstance.passiveEvents;
      this.activeEvents = programInstance.activeEvents;
    });
  }

  ngOnDestroy(): void {
    const dados = {
      activeEvents: this.activeEventsComponents.map((eventComponent) => {
        return eventComponent.form.value;
      }),
      passiveEvents: this.passiveEventsComponents.map((eventComponent) => {
        return eventComponent.form.value;
      }),
    };

    this.programAddService.saveLocalStep(dados);
  }

  addPassiveEvent() {
    this.passiveEvents.push(new Event());
  }

  addActiveEvent() {
    this.activeEvents.push(new ActiveEvent());
  }

  submit() {
    let valid = true;

    let errors = [];

    const dados = {
      activeEvents: this.activeEventsComponents.map((eventComponent) => {
        if (!eventComponent.validateForm()) {
          valid = false;
          errors.push({ field: 'Evento', message: 'Existem erros de cadastro, por favor verifique os campos em vermelho.' });
        }

        return eventComponent.form.value;
      }),
      passiveEvents: this.passiveEventsComponents.map((eventComponent) => {
        if (!eventComponent.validateForm()) {
          valid = false;
          errors.push({ field: 'Coleta por sensores', message: 'Existem erros de cadastro, por favor verifique os campos em vermelho.' });
        }

        return eventComponent.form.value;
      }),
    };

    if (isNullOrUndefined(this.programAddService.programValue.title) || this.programAddService.programValue.title == '') {
      errors.push({ field: 'Título do programa', message: 'Campo obrigatório.' });
      valid = false;
    }

    if (isNullOrUndefined(this.programAddService.programValue.observers) || this.programAddService.programValue.observers.length == 0) {
      errors.push({ field: 'Observadores', message: 'Selecione ao menos 1 observador para o programa' });
      valid = false;
    }

    if (isNullOrUndefined(this.programAddService.programValue.users) || this.programAddService.programValue.users.length == 0) {
      errors.push({ field: 'Participantes', message: 'Selecione ao menos 1 participante para o programa' });
      valid = false;
    }

    if (!valid) {
      this._swalService.showFieldErrors('Aviso', errors);
    } else {
      this.programAddService.saveLocalStep(dados);
      this.programAddService.saveProgram();
    }
  }
}
