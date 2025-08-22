/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EndpointsService {
  // Retorna o `path` formatado junto com o domínio
  get(url: string | string, params?: any[] | object): string {
    return this._getPath(url.toString(), params);
  }

  // Retorna apenas o `path` formatado
  private _getPath(schema: string, params?: any[] | object): string {
    let path = schema;
    if (params) {
      for (const i in params) {
        if (params.hasOwnProperty(i)) {
          const param = params[i];
          let value = '';
          if (param !== null && param !== undefined) {
            value = param.toString();
          }
          path = path.split(`{{${i}}}`).join(value);
        }
      }
    }
    return path;
  }
}
