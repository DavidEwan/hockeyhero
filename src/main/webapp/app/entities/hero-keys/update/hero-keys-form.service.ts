import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHeroKeys, NewHeroKeys } from '../hero-keys.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHeroKeys for edit and NewHeroKeysFormGroupInput for create.
 */
type HeroKeysFormGroupInput = IHeroKeys | PartialWithRequiredKeyOf<NewHeroKeys>;

type HeroKeysFormDefaults = Pick<NewHeroKeys, 'id' | 'hideMe'>;

type HeroKeysFormGroupContent = {
  id: FormControl<IHeroKeys['id'] | NewHeroKeys['id']>;
  hideMe: FormControl<IHeroKeys['hideMe']>;
  latitude: FormControl<IHeroKeys['latitude']>;
  longitude: FormControl<IHeroKeys['longitude']>;
  age: FormControl<IHeroKeys['age']>;
  myPosition: FormControl<IHeroKeys['myPosition']>;
  skill: FormControl<IHeroKeys['skill']>;
  heroDetails: FormControl<IHeroKeys['heroDetails']>;
};

export type HeroKeysFormGroup = FormGroup<HeroKeysFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HeroKeysFormService {
  createHeroKeysFormGroup(heroKeys: HeroKeysFormGroupInput = { id: null }): HeroKeysFormGroup {
    const heroKeysRawValue = {
      ...this.getFormDefaults(),
      ...heroKeys,
    };
    return new FormGroup<HeroKeysFormGroupContent>({
      id: new FormControl(
        { value: heroKeysRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      hideMe: new FormControl(heroKeysRawValue.hideMe),
      latitude: new FormControl(heroKeysRawValue.latitude),
      longitude: new FormControl(heroKeysRawValue.longitude),
      age: new FormControl(heroKeysRawValue.age),
      myPosition: new FormControl(heroKeysRawValue.myPosition),
      skill: new FormControl(heroKeysRawValue.skill),
      heroDetails: new FormControl(heroKeysRawValue.heroDetails),
    });
  }

  getHeroKeys(form: HeroKeysFormGroup): IHeroKeys | NewHeroKeys {
    return form.getRawValue() as IHeroKeys | NewHeroKeys;
  }

  resetForm(form: HeroKeysFormGroup, heroKeys: HeroKeysFormGroupInput): void {
    const heroKeysRawValue = { ...this.getFormDefaults(), ...heroKeys };
    form.reset(
      {
        ...heroKeysRawValue,
        id: { value: heroKeysRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HeroKeysFormDefaults {
    return {
      id: null,
      hideMe: false,
    };
  }
}
