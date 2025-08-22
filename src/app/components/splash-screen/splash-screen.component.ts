import { LoaderService } from './../../services/loader.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'sagui-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0.5,
        })
      ),
      transition('void <=> *', animate(300)),
    ]),
  ],
})
export class SplashScreenComponent {
  message: Subject<string> = this._loaderService.message;
  isLoading: Subject<boolean> = this._loaderService.isLoading;
  isInsideDataTables: boolean = false;

  constructor(private _loaderService: LoaderService) {}
}
