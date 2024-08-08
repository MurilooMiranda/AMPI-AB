import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { finalize, take } from 'rxjs/operators';
import { ESPIM_REST_Badges } from 'src/app/app.api';
import { DAOService } from 'src/app/private/dao/dao.service';
import { ActiveEvent, Badge, GamificationConditions } from 'src/app/private/models/event.model';
import { EndpointsService } from 'src/app/services/endpoints.service';
import { LoaderService } from 'src/app/services/loader.service';
import { isNullOrUndefined } from 'src/app/util/functions';
import { v4 as uuid } from 'uuid';

import { ModalAddBadgeComponent } from '../modal-add-badge/modal-add-badge.component';

@UntilDestroy({ checkProperties: true })
export class GamificationConditionsComponent implements OnInit {
  uid: string = uuid();
  openComplex: boolean = false;
  form: UntypedFormGroup;
  urlBadges: string = ESPIM_REST_Badges;

  @Input() activeEvent: ActiveEvent;
  @Input() eventGamificationConditions: GamificationConditions;
  @Output() response: EventEmitter<GamificationConditions> = new EventEmitter<GamificationConditions>();

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private readonly _modalService: BsModalService,
    private readonly _loaderService: LoaderService,
    private readonly _endpointsService: EndpointsService,
    private readonly _toastr: ToastrService,
    private readonly _daoService: DAOService
  ) {}

  ngOnInit() {
    this.form = this._formBuilder.group({
      completion_points: this._formBuilder.control(null, [Validators.min(0)]),
      completion_half_points: this._formBuilder.control(null, [Validators.min(0)]),
      uncomplete_points: this._formBuilder.control(null),
      badges: this._formBuilder.array([]),
    });

    if (!isNullOrUndefined(this.eventGamificationConditions)) {
      this.form.patchValue(this.eventGamificationConditions);
      this.eventGamificationConditions.badges.forEach((badge) => {
        this.adicionarBadge(new Badge(badge));
      });
    }

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.response.emit(new GamificationConditions(this.form.value));
    });
  }

  adicionarBadge(value: Badge): void {
    this.badgesFormArray.push(this._formBuilder.control(value));
  }

  removerBadge(index: number): void {
    if (this.activeEvent.id) {
      this.deleteBadge(index);
    } else {
      this.badgesFormArray.removeAt(index);
    }
  }

  get badgesFormArray(): UntypedFormArray {
    return this.form.get('badges') as UntypedFormArray;
  }

  openModalBadge(): void {
    const config: ModalOptions<ModalAddBadgeComponent> = {
      ignoreBackdropClick: true,
      initialState: {
        activeEvent: this.activeEvent,
      },
    };

    let _modalRef = this._modalService.show(ModalAddBadgeComponent, config);

    _modalRef.content.response.pipe(take(1)).subscribe((badge: Badge) => {
      this.adicionarBadge(badge);
    });
  }

  deleteBadge(index: number) {
    const badge = this.badgesFormArray.at(index).value;

    this._loaderService.show();
    this._daoService
      .deleteObject(this._endpointsService.get(this.urlBadges, { activeEventId: this.activeEvent.id }), badge.id.toString())
      .pipe(finalize(() => this._loaderService.hide()))
      .subscribe((resp) => {
        this._toastr.success(resp.message);
        this.badgesFormArray.removeAt(index);
      });
  }
}
