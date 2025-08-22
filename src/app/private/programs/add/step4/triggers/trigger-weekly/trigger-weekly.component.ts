import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Cron } from 'src/app/private/models/cron.model';
import { Trigger } from 'src/app/private/models/trigger.model';
import { NOTIFICATIONS_TYPES, WEEKLY_DAYS } from 'src/app/private/programs/constants';
import { minLengthArray } from 'src/app/util/functions';

@Component({
  selector: 'esm-trigger-weekly',
  templateUrl: './trigger-weekly.component.html',
  styleUrls: ['./trigger-weekly.component.scss'],
})
export class TriggerWeeklyComponent {
  @Output() response: EventEmitter<Trigger> = new EventEmitter<Trigger>();

  form: UntypedFormGroup = this.formBuilder.group({
    time: ['', Validators.required],
    notificationType: ['', Validators.required],
    timeout: ['', Validators.required],
    days: this.formBuilder.array([], minLengthArray(1)),
  });

  weeklyDays: any[] = WEEKLY_DAYS;
  notificationTypes: any[] = NOTIFICATIONS_TYPES;

  constructor(private formBuilder: UntypedFormBuilder) {
    this.weeklyDays.forEach(() => {
      (this.form.get('days') as UntypedFormArray).push(this.formBuilder.control(false));
    });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      let diasSelecionados = this.weeklyDays.filter((v, i) => this.form.controls.days.value[i]);
      let cron = new Cron();
      cron.convertFromForm(this.form.get('time').value, diasSelecionados);

      let trigger = new Trigger({
        condition: cron.toString(),
        priority: this.form.get('notificationType').value,
        timeout: this.form.get('timeout').value,
      });

      this.response.emit(trigger);
      this.form.reset();
    }
  }
}
