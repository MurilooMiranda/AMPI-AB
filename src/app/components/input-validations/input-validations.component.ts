import { message } from './../../util/validate';
import { inputFormsConfig } from './../../util/input-form-configs';
import { Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'input-validations',
  templateUrl: './input-validations.component.html',
  styleUrls: ['./input-validations.component.scss']
})
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
