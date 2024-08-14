import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'esm-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss'],
})
export class ListHeaderComponent implements OnInit {
  @Input() total: number;
  @Input() title: string;
  @Input() subtitle: string;
  constructor() {}

  ngOnInit() {}
}
