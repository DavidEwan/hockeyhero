import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HeroKeysFormService, HeroKeysFormGroup } from './hero-keys-form.service';
import { IHeroKeys } from '../hero-keys.model';
import { HeroKeysService } from '../service/hero-keys.service';
import { IHeroDetails } from 'app/entities/hero-details/hero-details.model';
import { HeroDetailsService } from 'app/entities/hero-details/service/hero-details.service';

@Component({
  selector: 'jhi-hero-keys-update',
  templateUrl: './hero-keys-update.component.html',
})
export class HeroKeysUpdateComponent implements OnInit {
  isSaving = false;
  heroKeys: IHeroKeys | null = null;

  heroDetailsCollection: IHeroDetails[] = [];

  editForm: HeroKeysFormGroup = this.heroKeysFormService.createHeroKeysFormGroup();

  constructor(
    protected heroKeysService: HeroKeysService,
    protected heroKeysFormService: HeroKeysFormService,
    protected heroDetailsService: HeroDetailsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareHeroDetails = (o1: IHeroDetails | null, o2: IHeroDetails | null): boolean => this.heroDetailsService.compareHeroDetails(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ heroKeys }) => {
      this.heroKeys = heroKeys;
      if (heroKeys) {
        this.updateForm(heroKeys);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const heroKeys = this.heroKeysFormService.getHeroKeys(this.editForm);
    if (heroKeys.id !== null) {
      this.subscribeToSaveResponse(this.heroKeysService.update(heroKeys));
    } else {
      this.subscribeToSaveResponse(this.heroKeysService.create(heroKeys));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHeroKeys>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(heroKeys: IHeroKeys): void {
    this.heroKeys = heroKeys;
    this.heroKeysFormService.resetForm(this.editForm, heroKeys);

    this.heroDetailsCollection = this.heroDetailsService.addHeroDetailsToCollectionIfMissing<IHeroDetails>(
      this.heroDetailsCollection,
      heroKeys.heroDetails
    );
  }

  protected loadRelationshipsOptions(): void {
    this.heroDetailsService
      .query({ filter: 'herokeys-is-null' })
      .pipe(map((res: HttpResponse<IHeroDetails[]>) => res.body ?? []))
      .pipe(
        map((heroDetails: IHeroDetails[]) =>
          this.heroDetailsService.addHeroDetailsToCollectionIfMissing<IHeroDetails>(heroDetails, this.heroKeys?.heroDetails)
        )
      )
      .subscribe((heroDetails: IHeroDetails[]) => (this.heroDetailsCollection = heroDetails));
  }
}
