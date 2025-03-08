import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { ActiveEvent, ComplexCondition, Event, GamificationConditions } from 'src/app/private/models/event.model';
import { Intervention } from 'src/app/private/models/intervention.model';
import { Trigger } from 'src/app/private/models/trigger.model';

import { ESPIM_REST_Programs } from '../../../../../app.api';
import { InterventionComponent } from '../intervention/intervention.component';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'esm-active-event',
  templateUrl: './active-event.component.html',
  styleUrls: ['./active-event.component.scss', './../step4.component.scss'],
})
export class ActiveEventComponent implements OnInit {
  urlPrograms: string = ESPIM_REST_Programs;
  @Input() event: ActiveEvent;
  @Input() events: Event[];
  @Input() index: number;
  isOpen: boolean = false;
  private _modalInterventionRef: BsModalRef;
  loadingInterventions: boolean = false;

  form: UntypedFormGroup = this.formBuilder.group({
    id: this.formBuilder.control(''),
    title: ['', Validators.required],
    type: this.formBuilder.control(''),
    color: this.formBuilder.control(''),
    description: this.formBuilder.control(''),
    triggers: this.formBuilder.array([]),
    manual: this.formBuilder.control(false),
    downloadable: this.formBuilder.control(false),
    ampiab: this.formBuilder.control(false),
    interventions: this.formBuilder.control([]),
    complexConditions: this.formBuilder.array([]),
    gamificationConditions: this.formBuilder.control(null),
  });

  constructor(private formBuilder: UntypedFormBuilder, private readonly _modalService: BsModalService) {}

  ngOnInit(): void {
    // Verifica se é um "NOVO EVENTO"
    if (
      !this.event.title &&
      !this.event.id &&
      this.event.triggers.length == 0 &&
      !this.event.color &&
      this.event.interventions.length == 0
    ) {
      this.isOpen = true;
    }

    if (this.event) {
      this.form.patchValue(this.event);
      // Adiciona as triggers e sensors ao evento
      this.event.triggers.forEach((it) => this.adicionarTrigger(new Trigger(it)));
    }
  }

  adicionarTrigger(value: Trigger): void {
    this.triggerFormArray.push(this.formBuilder.control(value));
  }

  removerTrigger(index: number): void {
    this.triggerFormArray.removeAt(index);
  }

  get triggerFormArray(): UntypedFormArray {
    return this.form.get('triggers') as UntypedFormArray;
  }

  get formValue(): any {
    return this.form.value;
  }

  updateFormComplexConditions(complexConditions: ComplexCondition[]) {
    this.event.complexConditions = complexConditions;
    this.complexConditionsFormArray.clear();
    complexConditions.forEach((it) => this.adicionarComplexCondition(it));
  }

  updateFormGamificationConditions(gamificationConditions: GamificationConditions) {
    this.event.gamificationConditions = gamificationConditions;
    this.form.get('gamificationConditions').setValue(gamificationConditions);
  }

  adicionarComplexCondition(complexCondition: ComplexCondition) {
    this.complexConditionsFormArray.push(this.formBuilder.control(complexCondition));
  }

  get complexConditionsFormArray(): UntypedFormArray {
    return this.form.get('complexConditions') as UntypedFormArray;
  }

  deleteEvent() {
    this.isOpen = !this.isOpen;
    this.form.reset();
    this.removeEvent(this.event);
    return;
  }

  removeEvent(event: Event) {
    this.events.splice(this.index, 1);
  }

  loadDetail() {
    this.isOpen = !this.isOpen;
  }

  // loadInterventions() {
  //   this.loadingInterventions = true;
  //   let programId = this.programAddService.programValue.id;

  //   this._daoService
  //     .getObjects(this.urlPrograms + programId + '/events/' + this.event.id + '/interventions')
  //     .pipe(finalize(() => (this.loadingInterventions = false)))
  //     .subscribe((response) => {
  //       let interventions = response.data.map((intervention) => this.interventionService.getInterventionClass(intervention));
  //       this.form.get('interventions').setValue(interventions);
  //     });
  // }

  validateForm(): boolean {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      this.isOpen = true;
    }

    return this.form.valid;
  }

  updateColor(color: string): void {
    this.form.get('color').setValue(color);
  }

  goToInterventions(): void {
    const config: ModalOptions<InterventionComponent> = {
      class: 'modal-fullscreen modal-intervention',
      keyboard: false,
      ignoreBackdropClick: true,
      initialState: {
        activeEvent: this.event,
        interventionsToInit: this.form.get('interventions').value,
      },
    };

    this._modalInterventionRef = this._modalService.show(InterventionComponent, config);

    this._modalInterventionRef.content.response.pipe(take(1)).subscribe((value: Intervention[]) => {
      this.form.get('interventions').setValue(value);
    });
  }
}
