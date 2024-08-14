import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'esm-choose-color',
  templateUrl: './choose-color.component.html',
  styleUrls: ['./choose-color.component.scss'],
})
export class ChooseColorComponent implements OnInit {
  @Output() response: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  choose(color: string) {
    this.response.emit(color);
  }
}
