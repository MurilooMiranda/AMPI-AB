import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MomentModule } from 'ngx-moment';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './app.shared.module';
import { ComponentsModule } from './components/components.module';
import { IndexModule } from './index/index.module';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { JsonDateInterceptor } from './interceptors/json-date.interceptor';
import { AuthInterceptor } from './security/auth.interceptor';
import { LoggedInGuard } from './security/loggedin.guard';
import { SecurityModule } from './security/security.module';
import { EndpointsService } from './services/endpoints.service';
import { LoaderService } from './services/loader.service';

// local modules
// tslint:disable-next-line:class-name
export class missingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    throw new Error(`No translation for ${params.key} available`);
  }
}

const providers = [LoaderService, EndpointsService];

@NgModule({
  declarations: [AppComponent],
  exports: [ToastrModule, ComponentsModule, SharedModule],
  bootstrap: [AppComponent],
  imports: [
    // imports modules
    BrowserModule,
    SharedModule,
    ComponentsModule,
    AppRoutingModule,
    IndexModule,
    MomentModule,
    SecurityModule,
    SweetAlert2Module.forRoot(),
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: true,
      disableTimeOut: false,
      preventDuplicates: true,
      enableHtml: true,
      progressBar: true,
      timeOut: 15000,
      extendedTimeOut: 15000,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: missingTranslationHandler },
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    // import services
    LoggedInGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JsonDateInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {
  static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers,
    };
  }
}

// required for AOT (ahead of time) compilation

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
