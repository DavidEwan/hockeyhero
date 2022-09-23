import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHeroDetails, NewHeroDetails } from '../hero-details.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHeroDetails for edit and NewHeroDetailsFormGroupInput for create.
 */
type HeroDetailsFormGroupInput = IHeroDetails | PartialWithRequiredKeyOf<NewHeroDetails>;

type HeroDetailsFormDefaults = Pick<NewHeroDetails, 'id'>;

type HeroDetailsFormGroupContent = {
  id: FormControl<IHeroDetails['id'] | NewHeroDetails['id']>;
  phone: FormControl<IHeroDetails['phone']>;
  dateOfBirth: FormControl<IHeroDetails['dateOfBirth']>;
  streetAddress: FormControl<IHeroDetails['streetAddress']>;
  city: FormControl<IHeroDetails['city']>;
  stateProvince: FormControl<IHeroDetails['stateProvince']>;
  postalCode: FormControl<IHeroDetails['postalCode']>;
  user: FormControl<IHeroDetails['user']>;
};

export type HeroDetailsFormGroup = FormGroup<HeroDetailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HeroDetailsFormService {
  createHeroDetailsFormGroup(heroDetails: HeroDetailsFormGroupInput = { id: null }): HeroDetailsFormGroup {
    const heroDetailsRawValue = {
      ...this.getFormDefaults(),
      ...heroDetails,
    };
    return new FormGroup<HeroDetailsFormGroupContent>({
      id: new FormControl(
        { value: heroDetailsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      phone: new FormControl(heroDetailsRawValue.phone),
      dateOfBirth: new FormControl(heroDetailsRawValue.dateOfBirth),
      streetAddress: new FormControl(heroDetailsRawValue.streetAddress),
      city: new FormControl(heroDetailsRawValue.city),
      stateProvince: new FormControl(heroDetailsRawValue.stateProvince),
      postalCode: new FormControl(heroDetailsRawValue.postalCode),
      user: new FormControl(heroDetailsRawValue.user),
    });
  }

  getHeroDetails(form: HeroDetailsFormGroup): IHeroDetails | NewHeroDetails {
    return form.getRawValue() as IHeroDetails | NewHeroDetails;
  }

  resetForm(form: HeroDetailsFormGroup, heroDetails: HeroDetailsFormGroupInput): void {
    const heroDetailsRawValue = { ...this.getFormDefaults(), ...heroDetails };
    form.reset(
      {
        ...heroDetailsRawValue,
        id: { value: heroDetailsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HeroDetailsFormDefaults {
    return {
      id: null,
    };
  }
}
