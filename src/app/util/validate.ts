import { isNullOrUndefined } from 'util';
/* eslint-disable unicorn/no-fn-reference-in-iterator */
import { AbstractControl, AsyncValidatorFn, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { isArray, isObject } from './functions';


// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ValidationResult = { [validator: string]: string | boolean };
export type AsyncValidatorArray = AsyncValidatorFn | AsyncValidatorFn[] | null;
export type ValidatorArray = Array<Validator | ValidatorFn>;

const normalizeValidator = (
  validator: Validator | ValidatorFn | AsyncValidatorFn
): ValidatorFn | AsyncValidatorFn => {
  const funcInit = validator;
  if (typeof funcInit === 'function') {
    return (c: AbstractControl) => funcInit(c);
  }

  const funcBind = (validator as Validator).validate.bind(validator);
  return typeof funcBind === 'function'
    ? (c: AbstractControl) => funcBind(c)
    : (validator as ValidatorFn | AsyncValidatorFn);
};

export const composeValidators = (validators: ValidatorArray): ValidatorFn => {
  if (!isArray(validators)) {
    validators = [validators];
  }
  if (validators === null || validators.length === 0) {
    return null;
  }
  return Validators.compose((validators as []).map(normalizeValidator));
};

export const composeAsyncValidators = (
  validators: AsyncValidatorArray
): AsyncValidatorFn => {
  if (!isArray(validators)) {
    validators = [validators];
  }
  if (validators === null || validators.length === 0) {
    return null;
  }
  return Validators.composeAsync(
    (validators as []).map(normalizeValidator) as AsyncValidatorFn[]
  );
};

export const handleValidationError = (
  errorMessage: string,
  label: string,
  paramsValidator: any = null
): string => {
  const re = /{label}/gi;
  errorMessage = errorMessage.replace(re, label);

  if (!isNullOrUndefined(paramsValidator) && isObject(paramsValidator)) {
    for (const param in paramsValidator) {
      if (paramsValidator.hasOwnProperty(param)) {
        const regex = new RegExp(`{${param}}`, 'gi');
        errorMessage = errorMessage.replace(regex, paramsValidator[param]);
      }
    }
  }

  return errorMessage;
};

export const message = (
  validator: ValidationErrors,
  key: string,
  label: string,
  validationMessages: any
): string => {
  if (Object.keys(validationMessages).includes(key)) {
    return handleValidationError(
      validationMessages[key],
      label,
      validator[key]
    );
  } else {
    return typeof validator[key] === 'string'
      ? (validator[key] as string)
      : handleValidationError(
          validationMessages.invalid,
          label,
          validator[key]
        );
  }
};
