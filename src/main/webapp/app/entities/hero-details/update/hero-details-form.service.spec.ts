import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../hero-details.test-samples';

import { HeroDetailsFormService } from './hero-details-form.service';

describe('HeroDetails Form Service', () => {
  let service: HeroDetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroDetailsFormService);
  });

  describe('Service methods', () => {
    describe('createHeroDetailsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHeroDetailsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            phone: expect.any(Object),
            dateOfBirth: expect.any(Object),
            streetAddress: expect.any(Object),
            city: expect.any(Object),
            stateProvince: expect.any(Object),
            postalCode: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IHeroDetails should create a new form with FormGroup', () => {
        const formGroup = service.createHeroDetailsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            phone: expect.any(Object),
            dateOfBirth: expect.any(Object),
            streetAddress: expect.any(Object),
            city: expect.any(Object),
            stateProvince: expect.any(Object),
            postalCode: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getHeroDetails', () => {
      it('should return NewHeroDetails for default HeroDetails initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHeroDetailsFormGroup(sampleWithNewData);

        const heroDetails = service.getHeroDetails(formGroup) as any;

        expect(heroDetails).toMatchObject(sampleWithNewData);
      });

      it('should return NewHeroDetails for empty HeroDetails initial value', () => {
        const formGroup = service.createHeroDetailsFormGroup();

        const heroDetails = service.getHeroDetails(formGroup) as any;

        expect(heroDetails).toMatchObject({});
      });

      it('should return IHeroDetails', () => {
        const formGroup = service.createHeroDetailsFormGroup(sampleWithRequiredData);

        const heroDetails = service.getHeroDetails(formGroup) as any;

        expect(heroDetails).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHeroDetails should not enable id FormControl', () => {
        const formGroup = service.createHeroDetailsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHeroDetails should disable id FormControl', () => {
        const formGroup = service.createHeroDetailsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
