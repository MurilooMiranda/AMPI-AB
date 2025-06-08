import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';

import { SharedModule } from '../../app.shared.module';
import { InputFileComponent } from '../components/input-file/input-file.component';
import { ProgramsAddComponent } from './add/programsadd.component';
import { StepPanelComponent } from './add/step-panel/step-panel.component';
import { Step1Component } from './add/step1/step1.component';
import { ModalAddObserverComponent } from './add/step2/modal-add-observer/modal-add-observer.component';
import { Step2Component } from './add/step2/step2.component';
import { ModalAddParticipantComponent } from './add/step3/modal-add-participant/modal-add-participant.component';
import { Step3Component } from './add/step3/step3.component';
import { ActiveEventComponent } from './add/step4/active-event/active-event.component';
import { ChooseColorComponent } from './add/step4/choose-color/choose-color.component';
import { ComplexConditionComponent } from './add/step4/complex-conditions/complex-conditions.component';
import { GamificationConditionsComponent } from './add/step4/gamification-conditions/gamification-conditions.component';
import { InterventionModule } from './add/step4/intervention/intervention.module';
import { ModalAddBadgeComponent } from './add/step4/modal-add-badge/modal-add-badge.component';
import { PassiveEventComponent } from './add/step4/passive-event/passive-event.component';
import { SensorsComponent } from './add/step4/sensors/sensors.component';
import { Step4Component } from './add/step4/step4.component';
import { RowHourComponent } from './add/step4/triggers/trigger-custom/row-hour/row-hour.component';
import { TriggerCustomComponent } from './add/step4/triggers/trigger-custom/trigger-custom.component';
import { TriggerDailyComponent } from './add/step4/triggers/trigger-daily/trigger-daily.component';
import { TriggerWeeklyComponent } from './add/step4/triggers/trigger-weekly/trigger-weekly.component';
import { TriggersComponent } from './add/step4/triggers/triggers.component';
import { UserCheckBoxComponent } from './add/user-checkbox/user-checkbox.component';
import { ProgramsListComponent } from './list/programslist.component';
import { ProgramsRoutingModule } from './programs-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';

// imports from dependencies

@NgModule({
  declarations: [
    ProgramsAddComponent,
    ProgramsListComponent,
    StepPanelComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    UserCheckBoxComponent,
    PassiveEventComponent,
    ActiveEventComponent,
    SensorsComponent,
    TriggersComponent,
    TriggerDailyComponent,
    TriggerWeeklyComponent,
    TriggerCustomComponent,
    RowHourComponent,
    ChooseColorComponent,
    ComplexConditionComponent,
    GamificationConditionsComponent,
    ModalAddObserverComponent,
    ModalAddBadgeComponent,
    ModalAddParticipantComponent,
    InputFileComponent,
  ],
  imports: [InterventionModule, PortalModule, SharedModule, ComponentsModule, ProgramsRoutingModule, CommonModule, ReactiveFormsModule, CollapseModule],
  exports: [],
})
export class ProgramsModule {}
