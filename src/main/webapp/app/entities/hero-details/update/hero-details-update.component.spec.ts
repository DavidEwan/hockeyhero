import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HeroDetailsFormService } from './hero-details-form.service';
import { HeroDetailsService } from '../service/hero-details.service';
import { IHeroDetails } from '../hero-details.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { HeroDetailsUpdateComponent } from './hero-details-update.component';

describe('HeroDetails Management Update Component', () => {
  let comp: HeroDetailsUpdateComponent;
  let fixture: ComponentFixture<HeroDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let heroDetailsFormService: HeroDetailsFormService;
  let heroDetailsService: HeroDetailsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HeroDetailsUpdateComponent],
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
      .overrideTemplate(HeroDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HeroDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    heroDetailsFormService = TestBed.inject(HeroDetailsFormService);
    heroDetailsService = TestBed.inject(HeroDetailsService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const heroDetails: IHeroDetails = { id: 456 };
      const user: IUser = { id: 74439 };
      heroDetails.user = user;

      const userCollection: IUser[] = [{ id: 14200 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ heroDetails });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const heroDetails: IHeroDetails = { id: 456 };
      const user: IUser = { id: 52022 };
      heroDetails.user = user;

      activatedRoute.data = of({ heroDetails });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.heroDetails).toEqual(heroDetails);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHeroDetails>>();
      const heroDetails = { id: 123 };
      jest.spyOn(heroDetailsFormService, 'getHeroDetails').mockReturnValue(heroDetails);
      jest.spyOn(heroDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ heroDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: heroDetails }));
      saveSubject.complete();

      // THEN
      expect(heroDetailsFormService.getHeroDetails).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(heroDetailsService.update).toHaveBeenCalledWith(expect.objectContaining(heroDetails));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHeroDetails>>();
      const heroDetails = { id: 123 };
      jest.spyOn(heroDetailsFormService, 'getHeroDetails').mockReturnValue({ id: null });
      jest.spyOn(heroDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ heroDetails: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: heroDetails }));
      saveSubject.complete();

      // THEN
      expect(heroDetailsFormService.getHeroDetails).toHaveBeenCalled();
      expect(heroDetailsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHeroDetails>>();
      const heroDetails = { id: 123 };
      jest.spyOn(heroDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ heroDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(heroDetailsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
