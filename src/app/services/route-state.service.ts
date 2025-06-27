import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteStateService {
  private _previousUrl: string;
  private _currentUrl: string;
  private _routeHistory: string[];

  private _subscription: Subscription;

  constructor(private readonly _router: Router) {}

  start(): void {
    this._routeHistory = [];
    this._subscription = this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this._setURLs(event));
  }

  finish(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  private _setURLs(event: NavigationEnd): void {
    const tempUrl = this._currentUrl;
    this._previousUrl = tempUrl;
    this._currentUrl = event.urlAfterRedirects;
    this._routeHistory.push(event.urlAfterRedirects);
  }

  get previousUrl(): string {
    return this._previousUrl;
  }

  get currentUrl(): string {
    return this._currentUrl;
  }

  get routeHistory(): string[] {
    return this._routeHistory;
  }
}
