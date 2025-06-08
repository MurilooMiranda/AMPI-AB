import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Media } from '../../models/media';

@Component({
  selector: 'esm-modal-show-midia',
  templateUrl: './modal-show-midia.component.html',
  styleUrls: ['./modal-show-midia.component.scss'],
})
export class ModalShowMidiaComponent implements OnInit {
  @Output() response: EventEmitter<Media> = new EventEmitter<Media>();
  @Input() media: Media;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  close() {
    this.bsModalRef.hide();
  }
}
