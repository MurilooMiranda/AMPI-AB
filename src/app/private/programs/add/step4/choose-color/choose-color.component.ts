import { Component, EventEmitter, OnInit, Output } from '@angular/core';

export class ChooseColorComponent implements OnInit {
  @Output() response: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  choose(color: string) {
    this.response.emit(color);
  }
}
