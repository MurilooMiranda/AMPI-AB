export class Sensor {
  /**
   * sensor: May be "activity", "location" or "measure_use".
   * collector: May be "smartphone" or "smartwatch"
   */
  id: number;
  sensor: string;
  collector: string;
}
