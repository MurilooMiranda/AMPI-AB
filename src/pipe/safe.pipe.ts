import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  transform(url: string): Observable<SafeUrl> {
    if (url.indexOf('amazonaws') > -1) {
      return of(this.sanitizer.bypassSecurityTrustUrl(url));
    }

    if (url.indexOf('cloudfront.net') > -1) {
      return of(this.sanitizer.bypassSecurityTrustUrl(url));
    }

    return this.http.get(url, { responseType: 'blob' }).pipe(
      // eslint-disable-next-line @typescript-eslint/typedef
      map((val) => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val)))
    );
  }
}
