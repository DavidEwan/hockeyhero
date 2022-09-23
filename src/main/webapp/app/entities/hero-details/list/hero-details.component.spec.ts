import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HeroDetailsService } from '../service/hero-details.service';

import { HeroDetailsComponent } from './hero-details.component';

describe('HeroDetails Management Component', () => {
  let comp: HeroDetailsComponent;
  let fixture: ComponentFixture<HeroDetailsComponent>;
  let service: HeroDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'hero-details', component: HeroDetailsComponent }]), HttpClientTestingModule],
      declarations: [HeroDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(HeroDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HeroDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HeroDetailsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.heroDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to heroDetailsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getHeroDetailsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getHeroDetailsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
