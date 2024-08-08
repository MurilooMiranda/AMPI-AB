import { message } from './../../util/validate';
import { inputFormsConfig } from './../../util/input-form-configs';
import { Component, Input } from '@angular/core';

export class InputValidationsComponent {
  @Input() errors: Array<string>;
  @Input() label: string;

  messages: Array<string>;
  constructor() {
  }

  public getMessages(): Array<string> {
    const erros = this.errors;
    const fails = Object.keys(erros || {}).map((k: any) =>
      message(erros, k, this.label, inputFormsConfig.validationMessages)
    );
    
    return fails;
  }

  
}
