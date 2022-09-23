import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../hero-keys.test-samples';

import { HeroKeysFormService } from './hero-keys-form.service';

describe('HeroKeys Form Service', () => {
  let service: HeroKeysFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroKeysFormService);
  });

  describe('Service methods', () => {
    describe('createHeroKeysFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHeroKeysFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            hideMe: expect.any(Object),
            latitude: expect.any(Object),
            longitude: expect.any(Object),
            age: expect.any(Object),
            myPosition: expect.any(Object),
            skill: expect.any(Object),
            heroDetails: expect.any(Object),
          })
        );
      });

      it('passing IHeroKeys should create a new form with FormGroup', () => {
        const formGroup = service.createHeroKeysFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            hideMe: expect.any(Object),
            latitude: expect.any(Object),
            longitude: expect.any(Object),
            age: expect.any(Object),
            myPosition: expect.any(Object),
            skill: expect.any(Object),
            heroDetails: expect.any(Object),
          })
        );
      });
    });

    describe('getHeroKeys', () => {
      it('should return NewHeroKeys for default HeroKeys initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHeroKeysFormGroup(sampleWithNewData);

        const heroKeys = service.getHeroKeys(formGroup) as any;

        expect(heroKeys).toMatchObject(sampleWithNewData);
      });

      it('should return NewHeroKeys for empty HeroKeys initial value', () => {
        const formGroup = service.createHeroKeysFormGroup();

        const heroKeys = service.getHeroKeys(formGroup) as any;

        expect(heroKeys).toMatchObject({});
      });

      it('should return IHeroKeys', () => {
        const formGroup = service.createHeroKeysFormGroup(sampleWithRequiredData);

        const heroKeys = service.getHeroKeys(formGroup) as any;

        expect(heroKeys).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHeroKeys should not enable id FormControl', () => {
        const formGroup = service.createHeroKeysFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHeroKeys should disable id FormControl', () => {
        const formGroup = service.createHeroKeysFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
