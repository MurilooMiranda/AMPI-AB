import { ElementRef } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

export class FormUtil {
  static setErrorsBackend(form: UntypedFormGroup, response: any, formElement: ElementRef = null): void {
    let errors = response.errors;

    if (response.error && response.message) {
      errors = response.message;
    }

    if (errors) {
      for (const error in errors) {
        if (errors.hasOwnProperty(error)) {
          if (form.get(error)) {
            form.get(error).setErrors({ server: errors[error][0] }, { emitEvent: false });
          }

          setTimeout(() => {
            if (formElement) {
              const invalidControl = formElement.nativeElement.querySelector('.ng-invalid');
              if (invalidControl) {
                invalidControl.focus();
              }
            }
          });
        }
      }
    }
  }
}
