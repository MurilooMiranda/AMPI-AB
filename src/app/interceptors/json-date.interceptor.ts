import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { isNullOrUndefined } from '../util/functions';

@Injectable()
export class JsonDateInterceptor implements HttpInterceptor {
  // eslint-disable-next-line max-len
  private _isoDateFormat: RegExp = /(\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((val: HttpEvent<any>) => {
        if (val instanceof HttpResponse) {
          const body = val.body;
          this.convert(body);
        }
        return val;
      })
    );
  }

  isIsoDateString(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'string') {
      return this._isoDateFormat.test(value);
    }
    return false;
  }

  convert(body: any): any {
    if (isNullOrUndefined(body)) {
      return body;
    }

    if (typeof body !== 'object') {
      return body;
    }

    for (const key of Object.keys(body)) {
      const value = body[key];
      if (this.isIsoDateString(value)) {
        const date = new Date(value);
        body[key] = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
      } else if (typeof value === 'object') {
        this.convert(value);
      }
    }
  }
}
