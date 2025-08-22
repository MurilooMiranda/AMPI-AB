import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';

import { SharedModule } from '../../app.shared.module';
import { ExternalApplicationAddComponent } from './add/add.component';
import { ExternalApplicationRoutingModule } from './external-applications-routing.module';
import { ExternalApplicationListComponent } from './list/list.component';
import { ParameterComponent } from './parameter/parameter.component';

// imports from dependencies

@NgModule({
  imports: [SharedModule, ComponentsModule, ExternalApplicationRoutingModule, CommonModule],
  exports: [SharedModule],
  declarations: [ExternalApplicationAddComponent, ExternalApplicationListComponent, ParameterComponent],
})
export class ExternalApplicationsModule {}
