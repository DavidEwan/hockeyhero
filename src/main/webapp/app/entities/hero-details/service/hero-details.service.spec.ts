import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IHeroDetails } from '../hero-details.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../hero-details.test-samples';

import { HeroDetailsService, RestHeroDetails } from './hero-details.service';

const requireRestSample: RestHeroDetails = {
  ...sampleWithRequiredData,
  dateOfBirth: sampleWithRequiredData.dateOfBirth?.format(DATE_FORMAT),
};

describe('HeroDetails Service', () => {
  let service: HeroDetailsService;
  let httpMock: HttpTestingController;
  let expectedResult: IHeroDetails | IHeroDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HeroDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a HeroDetails', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const heroDetails = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(heroDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HeroDetails', () => {
      const heroDetails = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(heroDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HeroDetails', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HeroDetails', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a HeroDetails', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHeroDetailsToCollectionIfMissing', () => {
      it('should add a HeroDetails to an empty array', () => {
        const heroDetails: IHeroDetails = sampleWithRequiredData;
        expectedResult = service.addHeroDetailsToCollectionIfMissing([], heroDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(heroDetails);
      });

      it('should not add a HeroDetails to an array that contains it', () => {
        const heroDetails: IHeroDetails = sampleWithRequiredData;
        const heroDetailsCollection: IHeroDetails[] = [
          {
            ...heroDetails,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHeroDetailsToCollectionIfMissing(heroDetailsCollection, heroDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HeroDetails to an array that doesn't contain it", () => {
        const heroDetails: IHeroDetails = sampleWithRequiredData;
        const heroDetailsCollection: IHeroDetails[] = [sampleWithPartialData];
        expectedResult = service.addHeroDetailsToCollectionIfMissing(heroDetailsCollection, heroDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(heroDetails);
      });

      it('should add only unique HeroDetails to an array', () => {
        const heroDetailsArray: IHeroDetails[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const heroDetailsCollection: IHeroDetails[] = [sampleWithRequiredData];
        expectedResult = service.addHeroDetailsToCollectionIfMissing(heroDetailsCollection, ...heroDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const heroDetails: IHeroDetails = sampleWithRequiredData;
        const heroDetails2: IHeroDetails = sampleWithPartialData;
        expectedResult = service.addHeroDetailsToCollectionIfMissing([], heroDetails, heroDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(heroDetails);
        expect(expectedResult).toContain(heroDetails2);
      });

      it('should accept null and undefined values', () => {
        const heroDetails: IHeroDetails = sampleWithRequiredData;
        expectedResult = service.addHeroDetailsToCollectionIfMissing([], null, heroDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(heroDetails);
      });

      it('should return initial array if no HeroDetails is added', () => {
        const heroDetailsCollection: IHeroDetails[] = [sampleWithRequiredData];
        expectedResult = service.addHeroDetailsToCollectionIfMissing(heroDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(heroDetailsCollection);
      });
    });

    describe('compareHeroDetails', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHeroDetails(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHeroDetails(entity1, entity2);
        const compareResult2 = service.compareHeroDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHeroDetails(entity1, entity2);
        const compareResult2 = service.compareHeroDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHeroDetails(entity1, entity2);
        const compareResult2 = service.compareHeroDetails(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
