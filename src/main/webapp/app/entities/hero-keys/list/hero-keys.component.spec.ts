import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HeroKeysService } from '../service/hero-keys.service';

import { HeroKeysComponent } from './hero-keys.component';

describe('HeroKeys Management Component', () => {
  let comp: HeroKeysComponent;
  let fixture: ComponentFixture<HeroKeysComponent>;
  let service: HeroKeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'hero-keys', component: HeroKeysComponent }]), HttpClientTestingModule],
      declarations: [HeroKeysComponent],
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
      .overrideTemplate(HeroKeysComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HeroKeysComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HeroKeysService);

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
    expect(comp.heroKeys?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to heroKeysService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getHeroKeysIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getHeroKeysIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
