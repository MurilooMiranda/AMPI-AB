import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { ExternalApplicationParameter } from '../../models/external-application.model';

@Component({
  selector: 'esm-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss'],
})
export class ParameterComponent implements OnInit {
  @Input() parameters: Array<ExternalApplicationParameter>;
  @Input() parameter: ExternalApplicationParameter;
  @Input() index: number;

  @Output() remover: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: UntypedFormGroup;

  constructor(private _formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: this._formBuilder.control('', [Validators.required]),
      key: this._formBuilder.control('', [Validators.required]),
      default_value: this._formBuilder.control('', [Validators.required]),
    });

    this.form.valueChanges.subscribe((value) => {
      Object.assign(this.parameter, value);
    });

    this.form.patchValue(this.parameter);
  }

  excluir() {
    this.remover.emit(true);
  }

  validateForm(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }
}
