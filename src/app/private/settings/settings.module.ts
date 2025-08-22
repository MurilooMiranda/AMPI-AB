import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';

import { SharedModule } from '../../app.shared.module';
import { EditComponent } from './edit/edit.component';
import { SettingsRoutingModule } from './settings-routing.module';

// imports from dependencies

@NgModule({
  imports: [SharedModule, ComponentsModule, SettingsRoutingModule, CommonModule],
  exports: [SharedModule],
  declarations: [EditComponent],
})
export class SettingsModule {}
