import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DAOService } from '../private/dao/dao.service';
import { ObserversService } from '../private/observers/observers.service';
import { SecurityModule } from '../security/security.module';
import { SharedModule } from './../app.shared.module';
import { ComponentsModule } from './../components/components.module';
import { DocumentationComponent } from './documentation/documentation.component';
import { DownloadComponent } from './download/download.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';
import { TeamComponent } from './team/team.component';
import { TimelineComponent } from './timeline/timeline.component';
import { WorksComponent } from './works/works.component';

//local components
@NgModule({
  imports: [CommonModule, IndexRoutingModule, TranslateModule, SecurityModule, ComponentsModule, ReactiveFormsModule, SharedModule],
  declarations: [
    IndexComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    WorksComponent,
    DownloadComponent,
    TimelineComponent,
    TeamComponent,
    DocumentationComponent,
  ],
  // providers: [
  //   DAOService,
  //   ObserversService,
  //   {
  //     provide: 'SocialAuthServiceConfig',
  //     useValue: {
  //       autoLogin: false,
  //       providers: [
  //         {
  //           id: GoogleLoginProvider.PROVIDER_ID,
  //           provider: new GoogleLoginProvider('497077852767-bktvt7of6h5dsc0qmbuksaa79i5iciva.apps.googleusercontent.com'),
  //         },
  //       ],
  //     } as SocialAuthServiceConfig,
  //   },
  // ],
  providers: [DAOService, ObserversService],
  exports: [ComponentsModule],
})
export class IndexModule {}
