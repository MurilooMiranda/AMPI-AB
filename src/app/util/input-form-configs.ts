export interface InputFormsValidationConfig {
    required?: string;
    pattern?: string;
    minlength?: string;
    maxlength?: string;
    invalid?: string;
    fileTypes?: string;
    fileMaxSize?: string;
    [index: string]: string;
  }

export interface InputFormsConfig {
    validationMessages?: InputFormsValidationConfig;
}
export const inputFormsConfig: InputFormsConfig = {
  validationMessages: {
    invalid: '{label} é inválido',
    required: '{label} é obrigatório',
    pattern: '{label} é inválido',
    min: '{label} deve ser maior ou igual a {min}',
    max: '{label} deve ser menor ou igual a {max}',
    minDate: '{label} deve ser maior ou igual a {minDate}',
    maxDate: '{label} deve ser menor ou igual a {maxDate}',
    maxlength: 'Forneça não mais que {requiredLength} caracteres',
    minlength: 'Forneça ao menos {requiredLength} caracteres',
    maxSelect: 'Selecione não mais que {maxSelect} dentre as opções',
    minSelect: 'Selecione ao menos {minSelect} dentre as opções',
    fileTypes: 'O tipo de arquivo [ {actualType} ] não é permitido',
    fileMaxSize:
      'Esse arquivo excede o tamanho máximo permitido de {maxFileSize}MB',
    minDimenssion:
      '{filename} não atende as dimenssões mínimas de {requiredDimenssion}',
    seiNumber: 'O número do processo {actualValue} não foi encontrado no SEI',
  }
};
