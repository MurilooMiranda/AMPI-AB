/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { HttpResponse } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';

/**
 * Determines if a reference is an `Array`.
 *
 * @param value Reference to check.
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

/**
 * Determines if a reference is a valid base64 string.
 *
 * @param value Reference to check.
 */
export function isBase64(value: any): value is string {
  const base64 = /^([\d+/A-Za-z]{4})*([\d+/A-Za-z]{4}|[\d+/A-Za-z]{3}=|[\d+/A-Za-z]{2}==)$/;

  return isString(value) && base64.test(value);
}

/**
 * Determines if a reference is a `Boolean`.
 *
 * @param value Reference to check.
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Determines if a reference is a `Date`.
 *
 * @param value Reference to check.
 */
export function isDate(value: any): value is Date {
  return Object.prototype.toString.call(value) === '[object Date]';
}

/**
 * Determines if a reference is a valid `Date`.
 *
 * @param value Reference to check.
 */
export function isDateValid(value: any): value is Date {
  return isDate(value) && !Number.isNaN(value.getTime());
}

/**
 * Determines if a reference is defined.
 *
 * @param value Reference to check.
 */
export function isDefined(value: any): boolean {
  return typeof value !== 'undefined';
}

/**
 * Determines if a reference is an `Error`.
 *
 * @param value Reference to check.
 */
export function isError(value: any): value is Error {
  return Object.prototype.toString.call(value) === '[object Error]' || value instanceof Error;
}

/**
 * Determines if a reference is a `Function`.
 *
 * @param value Reference to check.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * Determines if a reference is a valid GUID string.
 *
 * @param value Reference to check.
 */
export function isGuid(value: any): value is string {
  const guid = /^[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;

  return isString(value) && guid.test(value);
}

/**
 * Determines if a reference is `Infinity` (positive or negative).
 *
 * @param value Reference to check.
 */
export function isInfinity(value: any): value is number {
  return value === Infinity || value === -Infinity;
}

/**
 * Determines if a reference is `null`.
 *
 * @param value Reference to check.
 */
export function isNull(value: any): value is null {
  return value === null;
}

/**
 * Determines if a reference is `null` or `undefined`.
 *
 * @param value Reference to check.
 */
export function isNullOrUndefined(value: any): value is null {
  return isNull(value) || isUndefined(value) || value == 'null' || value == 'undefined';
}

export function toChar(num: number) {
  return String.fromCharCode(num);
}
/**
 * Determines if a reference is a `Number`.
 *
 * @param value Reference to check.
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

/**
 * Determines if a reference is an 'Object'.
 *
 * @param value Reference to check.
 */
export function isObject(value: any): value is object {
  return typeof value === 'object';
}

/**
 * Determines if a reference is a plain `Object`. A "plain" object is typically created by `{}` or
 * `new Object()`. Some types such as arrays and null, while technically objects, are not considered
 * plain objects.
 *
 * @param value Reference to check.
 */
export function isPlainObject(value: any): value is object {
  return isObject(value) && Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Determines if a reference is a `RegExp`.
 *
 * @param value Reference to check.
 */
export function isRegExp(value: any): value is RegExp {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

/**
 * Determines if a reference is a `String`.
 *
 * @param value Reference to check.
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * Determines if a reference is a `Symbol`.
 *
 * @param value Reference to check.
 */
export function isSymbol(value: any): value is symbol {
  return typeof value === 'symbol';
}

/**
 * Determines if a reference is `undefined`.
 *
 * @param value Reference to check.
 */
export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

/**
 * Converte um objeto para ser enviado com parametro de
 * uma requisição dataTable
 *
 * @param obj Reference to serialize.
 * @param prefix Prefix to start.
 * @param inDeep Serialize in deep properties
 */
export function serializeParamsDatatable(obj: any, prefix: string = null, inDeep: boolean = true): string {
  if (isArray(obj['order']) && obj['order']?.length && isArray(obj['columns']) && obj['columns']?.length) {
    let columnOrder = obj?.order[0]?.column;
    if (obj?.columns[columnOrder]?.name === 'dt-responsive') {
      columnOrder++;
    }
    const data = obj?.columns[columnOrder]?.data;
    const orderable = obj?.columns[columnOrder]?.orderable;

    if (!isNullOrUndefined(data) && orderable) {
      obj['dataTableOrder'] = obj['order'][0]['dir'];
      obj['dataTableSort'] = data;
    }
  }
  delete obj['columns'];
  delete obj['order'];

  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix : p;
      const v = obj[p];
      str.push(
        !isNullOrUndefined(v) && isObject(v)
          ? inDeep && Array.isArray(v)
            ? serializeParamsDatatable(v, k, false)
            : `${encodeURIComponent(k)}=${encodeURIComponent(isDate(v) ? v.toISOString() : JSON.stringify(v))}`
          : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      );

      if (k === 'search') {
        str.push(`q=${encodeURIComponent(v.value)}`);
      }
    }
  }
  return str.join('&');
}

/**
 * Converte os dados Blob retornados do servidor em um File
 *
 * @param name File name
 * @param data Blob data returned from server
 */
export function createFile(response: HttpResponse<any>, name?: string): File {
  if (isNullOrUndefined(name)) {
    name = response.headers.get('Content-Disposition');
    name = name
      ? name
          .replace(/^attachment;filename=/, '')
          .replace(/_/g, ' ')
          .replace(/"/g, '')
      : `relatorio.pdf`;
  }

  const file: any = response.body;
  file.lastModifiedDate = new Date();
  file.name = name;
  return file as File;
}

/**
 * Encontra o valor de uma propriedade de um objeto dado um path
 * @param obj objeto com a informação a ser localizada
 * @param path string com o caminho até a propriedade (árvore). Cada propriedade deve ser separada por ponto final
 * @return valor da propriedade ou NULL se a propriedade não for encontrada
 */
export function getPropertyValueFromObject(obj: any, path: string): any {
  path = path.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, ''); // strip a leading dot
  const a = path.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    if (obj.hasOwnProperty(k) && !isNullOrUndefined(obj[k])) {
      obj = obj[k];
    } else {
      return null;
    }
  }
  return obj;
}

/**
 * Verifica se um objeto tem uma propriedade dado um path
 * @param obj objeto com a informação a ser localizada
 * @param path string com o caminho até a propriedade (árvore). Cada propriedade deve ser separada por ponto final
 * @return true se a propriedade existe ou false caso contrário
 */
export function hasPropertyNested(obj: any, path: string) {
  path = path.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, ''); // strip a leading dot
  return path.split('.').every((x) => {
    if (typeof obj !== 'object' || obj === null || !obj.hasOwnProperty(x)) {
      return false;
    }
    obj = obj[x];
    return true;
  });
}

export function removeEmptyValues(obj: any): void {
  if (!isNullOrUndefined(obj)) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === 'object') {
        removeEmptyValues(obj[key]);
      } else if (isNullOrUndefined(obj[key])) {
        delete obj[key];
      }
    });
  }
}

export const minLengthArray = (min: number) => {
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.value.filter(Boolean).length >= min) return null;

    return { MinLengthArray: true };
  };
};
