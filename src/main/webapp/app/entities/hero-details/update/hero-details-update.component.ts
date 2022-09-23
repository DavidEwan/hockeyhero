import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HeroDetailsFormService, HeroDetailsFormGroup } from './hero-details-form.service';
import { IHeroDetails } from '../hero-details.model';
import { HeroDetailsService } from '../service/hero-details.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-hero-details-update',
  templateUrl: './hero-details-update.component.html',
})
export class HeroDetailsUpdateComponent implements OnInit {
  isSaving = false;
  heroDetails: IHeroDetails | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: HeroDetailsFormGroup = this.heroDetailsFormService.createHeroDetailsFormGroup();

  constructor(
    protected heroDetailsService: HeroDetailsService,
    protected heroDetailsFormService: HeroDetailsFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ heroDetails }) => {
      this.heroDetails = heroDetails;
      if (heroDetails) {
        this.updateForm(heroDetails);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const heroDetails = this.heroDetailsFormService.getHeroDetails(this.editForm);
    if (heroDetails.id !== null) {
      this.subscribeToSaveResponse(this.heroDetailsService.update(heroDetails));
    } else {
      this.subscribeToSaveResponse(this.heroDetailsService.create(heroDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHeroDetails>>): void {
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

  protected updateForm(heroDetails: IHeroDetails): void {
    this.heroDetails = heroDetails;
    this.heroDetailsFormService.resetForm(this.editForm, heroDetails);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, heroDetails.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.heroDetails?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
