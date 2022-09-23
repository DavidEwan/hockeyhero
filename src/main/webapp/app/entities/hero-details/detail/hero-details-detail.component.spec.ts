import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HeroDetailsDetailComponent } from './hero-details-detail.component';

describe('HeroDetails Management Detail Component', () => {
  let comp: HeroDetailsDetailComponent;
  let fixture: ComponentFixture<HeroDetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroDetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ heroDetails: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HeroDetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HeroDetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load heroDetails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.heroDetails).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
