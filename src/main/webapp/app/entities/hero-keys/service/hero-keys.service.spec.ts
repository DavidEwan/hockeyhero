import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHeroKeys } from '../hero-keys.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../hero-keys.test-samples';

import { HeroKeysService } from './hero-keys.service';

const requireRestSample: IHeroKeys = {
  ...sampleWithRequiredData,
};

describe('HeroKeys Service', () => {
  let service: HeroKeysService;
  let httpMock: HttpTestingController;
  let expectedResult: IHeroKeys | IHeroKeys[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HeroKeysService);
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

    it('should create a HeroKeys', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const heroKeys = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(heroKeys).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HeroKeys', () => {
      const heroKeys = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(heroKeys).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HeroKeys', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HeroKeys', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a HeroKeys', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHeroKeysToCollectionIfMissing', () => {
      it('should add a HeroKeys to an empty array', () => {
        const heroKeys: IHeroKeys = sampleWithRequiredData;
        expectedResult = service.addHeroKeysToCollectionIfMissing([], heroKeys);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(heroKeys);
      });

      it('should not add a HeroKeys to an array that contains it', () => {
        const heroKeys: IHeroKeys = sampleWithRequiredData;
        const heroKeysCollection: IHeroKeys[] = [
          {
            ...heroKeys,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHeroKeysToCollectionIfMissing(heroKeysCollection, heroKeys);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HeroKeys to an array that doesn't contain it", () => {
        const heroKeys: IHeroKeys = sampleWithRequiredData;
        const heroKeysCollection: IHeroKeys[] = [sampleWithPartialData];
        expectedResult = service.addHeroKeysToCollectionIfMissing(heroKeysCollection, heroKeys);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(heroKeys);
      });

      it('should add only unique HeroKeys to an array', () => {
        const heroKeysArray: IHeroKeys[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const heroKeysCollection: IHeroKeys[] = [sampleWithRequiredData];
        expectedResult = service.addHeroKeysToCollectionIfMissing(heroKeysCollection, ...heroKeysArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const heroKeys: IHeroKeys = sampleWithRequiredData;
        const heroKeys2: IHeroKeys = sampleWithPartialData;
        expectedResult = service.addHeroKeysToCollectionIfMissing([], heroKeys, heroKeys2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(heroKeys);
        expect(expectedResult).toContain(heroKeys2);
      });

      it('should accept null and undefined values', () => {
        const heroKeys: IHeroKeys = sampleWithRequiredData;
        expectedResult = service.addHeroKeysToCollectionIfMissing([], null, heroKeys, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(heroKeys);
      });

      it('should return initial array if no HeroKeys is added', () => {
        const heroKeysCollection: IHeroKeys[] = [sampleWithRequiredData];
        expectedResult = service.addHeroKeysToCollectionIfMissing(heroKeysCollection, undefined, null);
        expect(expectedResult).toEqual(heroKeysCollection);
      });
    });

    describe('compareHeroKeys', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHeroKeys(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHeroKeys(entity1, entity2);
        const compareResult2 = service.compareHeroKeys(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHeroKeys(entity1, entity2);
        const compareResult2 = service.compareHeroKeys(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHeroKeys(entity1, entity2);
        const compareResult2 = service.compareHeroKeys(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
