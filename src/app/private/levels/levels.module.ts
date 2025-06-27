import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';

import { SharedModule } from '../../app.shared.module';
import { LevelsAddComponent } from './add/add.component';
import { LevelsRoutingModule } from './levels-routing.module';
import { LevelListComponent } from './list/list.component';

// imports from dependencies

@NgModule({
  imports: [SharedModule, ComponentsModule, LevelsRoutingModule, CommonModule],
  exports: [SharedModule],
  declarations: [LevelsAddComponent, LevelListComponent],
})
export class LevelsModule {}
