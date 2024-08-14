import { Component, EventEmitter, Output, ViewChildren } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Cron } from 'src/app/private/models/cron.model';
import { Day, Hour } from 'src/app/private/models/date.model';
import { Trigger } from 'src/app/private/models/trigger.model';
import { NOTIFICATIONS_TYPES, WEEKLY_DAYS } from 'src/app/private/programs/constants';
import { minLengthArray } from 'src/app/util/functions';

import { RowHourComponent } from './row-hour/row-hour.component';

@Component({
  selector: 'esm-trigger-custom',
  templateUrl: './trigger-custom.component.html',
  styleUrls: ['./trigger-custom.component.scss'],
})
export class TriggerCustomComponent {
  @ViewChildren(RowHourComponent) hourRows: RowHourComponent[];
  @Output() response: EventEmitter<Trigger[]> = new EventEmitter<Trigger[]>();

  form: UntypedFormGroup = this.formBuilder.group({
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
    let dados = this.weeklyDays.filter((v, i) => this.form.controls.days.value[i]);

    // Validate hours
    let validHours = true;
    this.hourRows.forEach((hourRow) => {
      if (!hourRow.validateForm()) {
        validHours = false;
      }
    });

    // Validate days selected
    this.form.markAllAsTouched();

    if (this.form.valid && validHours) {
      let triggers = [];

      dados.forEach((day: Day) => {
        day.hours.forEach((hour: Hour) => {
          let cron = new Cron();
          cron.convertFromForm(hour.time, [day]);
          triggers.push(
            new Trigger({
              condition: cron.toString(),
              priority: hour.notificationType,
              timeout: hour.timeout,
            })
          );
        });
      });

      this.response.emit(triggers);

      this.form.reset();
      this.weeklyDays.forEach((day: Day) => {
        day.hours = [];
      });
    }
  }

  selectWeekDay($event, weekDay: Day): void {
    if ($event.target.checked) {
      this.addHour(weekDay);
    } else {
      weekDay.hours = [];
    }
  }

  addHour(weekDay: Day): void {
    if (!weekDay.hours) {
      weekDay.hours = [];
    }
    weekDay.hours.push(new Hour());

    // Update form controls
    // Because controls are only updated with click in input
    let index = this.weeklyDays.findIndex((value) => value.alias === weekDay.alias);
    let currentValues = this.form.get('days').value;
    currentValues[index] = true;
    this.form.get('days').setValue(currentValues);
  }

  removeHour(weekDay: Day, index: number): void {
    weekDay.hours.splice(index, 1);

    // Update form controls
    // Because controls are only updated with click in input
    let currentValues = this.form.get('days').value;
    currentValues[index] = false;
    this.form.get('days').setValue(currentValues);
  }

  updateHour($event, weekDay: Day, index: number) {
    Object.assign(weekDay.hours[index], $event);
  }
}
