/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private _prefix: string = 'esm_';
  private _ls: any = new SecureLS({ encodingType: 'aes' });

  Get(key: string): any {
    return this._ls.get(`${this._prefix}${key}`);
  }

  Set(key: string, value: any): void {
    this._ls.set(`${this._prefix}${key}`, value);
  }

  Remove(key: string): void {
    this._ls.remove(`${this._prefix}${key}`);
  }

  Clear() {
    this._ls.removeAll();
  }
}
