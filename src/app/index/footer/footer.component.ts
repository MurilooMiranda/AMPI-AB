import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export class FooterComponent implements OnInit {
  constructor(private translate: TranslateService) {
    // translate.setDefaultLang('en');
  }

  chooseLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {}
}
