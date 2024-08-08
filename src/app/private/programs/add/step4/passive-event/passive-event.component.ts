import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Event } from 'src/app/private/models/event.model';
import { Sensor } from 'src/app/private/models/sensor.model';
import { Trigger } from 'src/app/private/models/trigger.model';

@UntilDestroy({ checkProperties: true })
export class PassiveEventComponent implements OnInit {
  @Input() event: Event;
  @Input() events: Event[];
  @Input() index: number;

  isOpen: boolean = false;

  form: UntypedFormGroup = this.formBuilder.group({
    id: this.formBuilder.control(''),
    title: ['', Validators.required],
    color: this.formBuilder.control(''),
    description: this.formBuilder.control(''),
    sensors: this.formBuilder.array([]),
    triggers: this.formBuilder.array([]),
  });

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    if (!this.event.id) {
      this.isOpen = true;
    }

    if (this.event) {
      this.form.patchValue(this.event);
      // Adiciona as triggers e sensors ao evento
      this.event.triggers.forEach((it) => this.adicionarTrigger(new Trigger(it)));
      this.event.sensors.forEach((it) => this.adicionarSensor(it as Sensor));
    }
  }

  updateFormSensors(sensors: Sensor[]) {
    this.sensorFormArray.clear();
    sensors.forEach((it) => this.adicionarSensor(it));
  }

  adicionarSensor(sensor: Sensor) {
    this.sensorFormArray.push(this.formBuilder.control(sensor));
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

  get sensorFormArray(): UntypedFormArray {
    return this.form.get('sensors') as UntypedFormArray;
  }

  get formValue(): any {
    return this.form.value;
  }

  deleteEvent() {
    this.isOpen = !this.isOpen;
    this.form.reset();
    this.removeEvent(this.event);
  }

  removeEvent(event: Event) {
    this.events.splice(this.index, 1);
  }

  loadDetail() {
    this.isOpen = !this.isOpen;
  }

  validateForm(): boolean {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      this.isOpen = true;
    }
    return this.form.valid;
  }
}
