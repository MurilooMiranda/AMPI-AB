import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ESPIM_REST_ExternalApplications } from 'src/app/app.api';
import { DAOService } from 'src/app/private/dao/dao.service';
import { ExternalApplication } from 'src/app/private/models/external-application.model';
import { TaskIntervention } from 'src/app/private/models/intervention.model';

@Component({
  selector: 'esm-external-media',
  templateUrl: './external-media.component.html',
  styleUrls: ['./external-media.component.scss'],
})
export class ExternalMediaComponent implements OnInit {
  urlExternalApplications: string = ESPIM_REST_ExternalApplications;

  @Input() intervention: TaskIntervention;
  @Input() graphIndex: number;

  packages: ExternalApplication[] = [
    {
      name: 'Youtube',
      package: 'youtube',
      parameters: [
        {
          key: 'youtube',
          name: 'Digite a URL do Youtube',
        },
      ],
    },
    {
      name: 'Navegador',
      package: 'navegador',
      parameters: [
        {
          key: 'navegador',
          name: 'Digite a URL da aplicação',
        },
      ],
    },
    {
      name: 'Personalizado',
      package: 'personalizado',
      parameters: [
        {
          key: 'personalizado',
          name: 'Digite a URL da PlayStore',
        },
      ],
    },
  ];
  constructor(private daoService: DAOService) {}

  get selectedPackage() {
    return this.packages.find((pkg) => pkg.package == this.intervention.app_package)?.parameters;
  }

  ngOnInit(): void {
    this.getExternalApplications().subscribe((resp) => {
      resp.data.forEach((externalApp) => {
        this.packages.push(externalApp);
      });
    });
  }

  packageChanged() {
    // Set default values
    this.selectedPackage.forEach((param) => {
      this.intervention.parameters[param.key] = param.default_value;
    });
  }

  getExternalApplications(): Observable<{ data: ExternalApplication[] }> {
    return this.daoService.getObjects(this.urlExternalApplications, { all: true });
  }
}
