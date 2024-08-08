import { Component, Input, OnInit } from '@angular/core';

export class ListHeaderComponent implements OnInit {
  @Input() total: number;
  @Input() title: string;
  @Input() subtitle: string;
  constructor() {}

  ngOnInit() {}
}
