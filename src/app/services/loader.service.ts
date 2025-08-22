import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  message: BehaviorSubject<string> = new BehaviorSubject<string>('Iniciando o sistema');
  count: number = 1;

  show(message: string = 'Carregando dados'): void {
    this.count++;
    this.isLoading.next(true);
    this.message.next(message);
  }

  hide(): void {
    this.count -= this.count > 0 ? 1 : 0;
    this.isLoading.next(!!this.count);
  }
}
