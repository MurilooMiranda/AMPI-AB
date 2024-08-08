import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProgramsAddService } from './programsadd.service';
import { StepPanelComponent } from './step-panel/step-panel.component';

export class ProgramsAddComponent {
  @ViewChild(StepPanelComponent) stepPanel: StepPanelComponent;
  constructor(private router: Router, private activeRoute: ActivatedRoute, private programsAddService: ProgramsAddService) {}

  ngOnInit() {
    let id = this.activeRoute.snapshot.params.id;

    this.programsAddService.clearData();

    if (id) {
      this.programsAddService.fetchData(id);
    } else {
      this.router.navigate(['./first'], {
        relativeTo: this.activeRoute,
        queryParams: { reset: true },
      });

      this.programsAddService.clearData();
    }
  }
}
