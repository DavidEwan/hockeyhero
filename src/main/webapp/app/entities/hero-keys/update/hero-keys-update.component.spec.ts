import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HeroKeysFormService } from './hero-keys-form.service';
import { HeroKeysService } from '../service/hero-keys.service';
import { IHeroKeys } from '../hero-keys.model';
import { IHeroDetails } from 'app/entities/hero-details/hero-details.model';
import { HeroDetailsService } from 'app/entities/hero-details/service/hero-details.service';

import { HeroKeysUpdateComponent } from './hero-keys-update.component';

describe('HeroKeys Management Update Component', () => {
  let comp: HeroKeysUpdateComponent;
  let fixture: ComponentFixture<HeroKeysUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let heroKeysFormService: HeroKeysFormService;
  let heroKeysService: HeroKeysService;
  let heroDetailsService: HeroDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HeroKeysUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(HeroKeysUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HeroKeysUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    heroKeysFormService = TestBed.inject(HeroKeysFormService);
    heroKeysService = TestBed.inject(HeroKeysService);
    heroDetailsService = TestBed.inject(HeroDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call heroDetails query and add missing value', () => {
      const heroKeys: IHeroKeys = { id: 456 };
      const heroDetails: IHeroDetails = { id: 95692 };
      heroKeys.heroDetails = heroDetails;

      const heroDetailsCollection: IHeroDetails[] = [{ id: 43831 }];
      jest.spyOn(heroDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: heroDetailsCollection })));
      const expectedCollection: IHeroDetails[] = [heroDetails, ...heroDetailsCollection];
      jest.spyOn(heroDetailsService, 'addHeroDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ heroKeys });
      comp.ngOnInit();

      expect(heroDetailsService.query).toHaveBeenCalled();
      expect(heroDetailsService.addHeroDetailsToCollectionIfMissing).toHaveBeenCalledWith(heroDetailsCollection, heroDetails);
      expect(comp.heroDetailsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const heroKeys: IHeroKeys = { id: 456 };
      const heroDetails: IHeroDetails = { id: 67687 };
      heroKeys.heroDetails = heroDetails;

      activatedRoute.data = of({ heroKeys });
      comp.ngOnInit();

      expect(comp.heroDetailsCollection).toContain(heroDetails);
      expect(comp.heroKeys).toEqual(heroKeys);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHeroKeys>>();
      const heroKeys = { id: 123 };
      jest.spyOn(heroKeysFormService, 'getHeroKeys').mockReturnValue(heroKeys);
      jest.spyOn(heroKeysService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ heroKeys });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: heroKeys }));
      saveSubject.complete();

      // THEN
      expect(heroKeysFormService.getHeroKeys).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(heroKeysService.update).toHaveBeenCalledWith(expect.objectContaining(heroKeys));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHeroKeys>>();
      const heroKeys = { id: 123 };
      jest.spyOn(heroKeysFormService, 'getHeroKeys').mockReturnValue({ id: null });
      jest.spyOn(heroKeysService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ heroKeys: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: heroKeys }));
      saveSubject.complete();

      // THEN
      expect(heroKeysFormService.getHeroKeys).toHaveBeenCalled();
      expect(heroKeysService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHeroKeys>>();
      const heroKeys = { id: 123 };
      jest.spyOn(heroKeysService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ heroKeys });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(heroKeysService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareHeroDetails', () => {
      it('Should forward to heroDetailsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(heroDetailsService, 'compareHeroDetails');
        comp.compareHeroDetails(entity, entity2);
        expect(heroDetailsService.compareHeroDetails).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
