import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

export class SearchComponent implements OnInit {
  form: UntypedFormGroup;
  @Output() doSearch: EventEmitter<any> = new EventEmitter();

  constructor(private readonly _formBuilder: UntypedFormBuilder) {}

  handleChange($event: any): void {
    this.doSearch.emit($event);
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      query: [''],
    });
  }
}
