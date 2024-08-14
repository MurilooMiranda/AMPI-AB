import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Program } from 'src/app/private/models/program.model';

import { ProgramsAddService } from '../programsadd.service';

@Component({
  selector: 'esm-step-panel',
  styleUrls: ['./step-panel.component.scss'],

  templateUrl: './step-panel.component.html',
})
export class StepPanelComponent implements OnInit {
  program: Observable<Program>; // These are the observers of this program

  currentStep: number = 1;
  biggerStepOpened: number = 1;

  constructor(private programAddService: ProgramsAddService, private activeRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.program = this.programAddService.program;

    let id = this.activeRoute.snapshot.params.id;
    if (id) {
      this.biggerStepOpened = 4;
      this.updateStep(this.router.url);
    }

    // Subscribes to url changes. At first there will be a 'reset' queryParam that indicates that the currentStep shall be reseted. Then, it will listen to url changes and update the currentStep accordingly
    this.router.events.subscribe((value: NavigationEnd) => {
      if (this.activeRoute.snapshot.queryParamMap.get('reset')) {
        this.currentStep = 1;
        return;
      }
      this.updateStep(value.urlAfterRedirects);
    });
  }

  updateStep(url: string) {
    if (!url) return;
    const urlArray = url.split('/');
    const urlStep = urlArray.pop();

    let step: number;
    if (urlStep.startsWith('first')) step = 1;
    else if (urlStep.startsWith('second')) step = 2;
    else if (urlStep.startsWith('third')) step = 3;
    else if (urlStep.startsWith('fourth')) step = 4;

    this.currentStep = step;

    if (step > this.biggerStepOpened) {
      this.biggerStepOpened = step;
    }
  }
}
