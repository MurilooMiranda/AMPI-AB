import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import { Sensor } from 'src/app/private/models/sensor.model';
import { v4 as uuid } from 'uuid';

import { COLLECTORS, SENSORS_LIST } from '../../../constants';

@Component({
  selector: 'esm-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss'],
})
export class SensorsComponent implements OnInit {
  sensors: any[] = cloneDeep(SENSORS_LIST);
  collectors: any[] = COLLECTORS;
  uid: string = uuid();
  @Input() eventSensors: Sensor[];
  @Output() response: EventEmitter<Sensor[]> = new EventEmitter<Sensor[]>();

  ngOnInit() {
    if (this.eventSensors) {
      this.eventSensors.forEach((it) => {
        // Atualiza o [value] da lista de sensores
        this.sensors.find((sensorItem) => sensorItem.alias == it.sensor).value = it.collector;
      });
    }
  }

  changeSensor() {
    let selectedSensors = this.sensors
      .filter((it) => it.value)
      .map((sensor) => {
        return {
          sensor: sensor.alias,
          collector: sensor.value,
        } as Sensor;
      });

    this.response.emit(selectedSensors);
  }

  clearValue(sensor: any) {
    sensor.value = null;
    this.changeSensor();
  }
}
