import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HeroKeysDetailComponent } from './hero-keys-detail.component';

describe('HeroKeys Management Detail Component', () => {
  let comp: HeroKeysDetailComponent;
  let fixture: ComponentFixture<HeroKeysDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroKeysDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ heroKeys: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HeroKeysDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HeroKeysDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load heroKeys on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.heroKeys).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
