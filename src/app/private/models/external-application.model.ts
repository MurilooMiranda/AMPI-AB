export class ExternalApplication {
  id?: number;
  name: string = '';
  package: string = '';
  parameters: ExternalApplicationParameter[];
}

export class ExternalApplicationParameter {
  id?: number;
  name: string = '';
  key: string = '';
  default_value?: string = '';
}
