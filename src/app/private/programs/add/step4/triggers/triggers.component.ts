import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Trigger } from 'src/app/private/models/trigger.model';
import { v4 as uuid } from 'uuid';

export class TriggersComponent {
  @Output() response: EventEmitter<Trigger> = new EventEmitter<Trigger>();
  uid: string = uuid();

  choices: any[] = [
    {
      alias: 'daily',
      name: 'Diariamente',
    },
    {
      alias: 'weekly',
      name: 'Semanalmente',
    },
    {
      alias: 'custom',
      name: 'Customizável',
    },
  ];

  form: UntypedFormGroup = this.formBuilder.group({
    selectedChoice: this.formBuilder.control(''),
  });

  constructor(private formBuilder: UntypedFormBuilder) {}

  addTriggers(triggers: Trigger[]): void {
    triggers.forEach((trigger: Trigger) => {
      this.addTrigger(trigger);
    });
  }

  clearValue(): void {
    this.form.get('selectedChoice').setValue('');
  }

  addTrigger(trigger): void {
    this.response.emit(trigger);
  }
}
