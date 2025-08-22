import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';

import { SharedModule } from './../../app.shared.module';
import { ParticipanstAddComponent } from './add/participantsadd.component';
import { ParticipantsListComponent } from './list/participantslist.component';
import { ParticipantsRoutingModule } from './participants-routing.module';

// imports from dependencies

@NgModule({
  imports: [SharedModule, ComponentsModule, ParticipantsRoutingModule, CommonModule],
  exports: [SharedModule],
  declarations: [ParticipanstAddComponent, ParticipantsListComponent],
})
export class ParticipantModule {}
