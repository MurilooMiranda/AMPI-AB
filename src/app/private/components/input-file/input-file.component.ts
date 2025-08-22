import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';
import { ESPIM_REST_Media } from 'src/app/app.api';
import { LoaderService } from 'src/app/services/loader.service';

import { DAOService } from '../../dao/dao.service';
import { Media } from '../../models/media';

@Component({
  selector: 'esm-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
})
export class InputFileComponent implements OnInit {
  @Output() response: EventEmitter<Media> = new EventEmitter<Media>();
  @ViewChild('inputFile')
  inputFile: ElementRef;

  urlUpload: string = ESPIM_REST_Media;
  file: any = null;
  media: Media = null;
  constructor(private sanitizer: DomSanitizer, private readonly _daoService: DAOService, private _loaderService: LoaderService) {}

  ngOnInit(): void {}

  selectFile(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let type = file.type.split('/')[0];

      this.file = {
        type: type,
        file: file,
        url: this.sanitize(URL.createObjectURL(file)),
      };

      this.uploadFile();
    } else {
      this.file = null;
    }
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  removerMidia() {
    this.media = null;
    this.inputFile.nativeElement.value = '';
    this.file = null;
    this.response.emit(null);
  }

  uploadFile() {
    const formData: FormData = new FormData();
    formData.append('file', this.file.file);
    this._loaderService.show();
    this._daoService
      .postObject(this.urlUpload, formData)
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((resp) => {
        this.media = resp.data;
        this.response.emit(resp.data);
      });
  }
}
