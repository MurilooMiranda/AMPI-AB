import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';

import { SharedModule } from '../../app.shared.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { RolesRoutingModule } from './roles-routing.module';

// imports from dependencies

@NgModule({
  imports: [SharedModule, ComponentsModule, RolesRoutingModule, CommonModule],
  exports: [SharedModule],
  declarations: [AddComponent, ListComponent],
})
export class RolesModule {}
