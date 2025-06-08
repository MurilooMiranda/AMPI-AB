import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SafePipe } from 'src/pipe/safe.pipe';

import { CloseMenuDirective } from './directives/close-menu.directive';
import { FocusInput } from './directives/focus-input';
import { FocusInvalidInputDirective } from './directives/focus-invalid-input';

const components = [FocusInvalidInputDirective, FocusInput, CloseMenuDirective];

const pipes = [SafePipe];
@NgModule({
  declarations: [...components, ...pipes],
  imports: [],
  exports: [...components, ...pipes, NgxPermissionsModule],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
