import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHeroDetails, NewHeroDetails } from '../hero-details.model';

export type PartialUpdateHeroDetails = Partial<IHeroDetails> & Pick<IHeroDetails, 'id'>;

type RestOf<T extends IHeroDetails | NewHeroDetails> = Omit<T, 'dateOfBirth'> & {
  dateOfBirth?: string | null;
};

export type RestHeroDetails = RestOf<IHeroDetails>;

export type NewRestHeroDetails = RestOf<NewHeroDetails>;

export type PartialUpdateRestHeroDetails = RestOf<PartialUpdateHeroDetails>;

export type EntityResponseType = HttpResponse<IHeroDetails>;
export type EntityArrayResponseType = HttpResponse<IHeroDetails[]>;

@Injectable({ providedIn: 'root' })
export class HeroDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/hero-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(heroDetails: NewHeroDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(heroDetails);
    return this.http
      .post<RestHeroDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(heroDetails: IHeroDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(heroDetails);
    return this.http
      .put<RestHeroDetails>(`${this.resourceUrl}/${this.getHeroDetailsIdentifier(heroDetails)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(heroDetails: PartialUpdateHeroDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(heroDetails);
    return this.http
      .patch<RestHeroDetails>(`${this.resourceUrl}/${this.getHeroDetailsIdentifier(heroDetails)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestHeroDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestHeroDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHeroDetailsIdentifier(heroDetails: Pick<IHeroDetails, 'id'>): number {
    return heroDetails.id;
  }

  compareHeroDetails(o1: Pick<IHeroDetails, 'id'> | null, o2: Pick<IHeroDetails, 'id'> | null): boolean {
    return o1 && o2 ? this.getHeroDetailsIdentifier(o1) === this.getHeroDetailsIdentifier(o2) : o1 === o2;
  }

  addHeroDetailsToCollectionIfMissing<Type extends Pick<IHeroDetails, 'id'>>(
    heroDetailsCollection: Type[],
    ...heroDetailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const heroDetails: Type[] = heroDetailsToCheck.filter(isPresent);
    if (heroDetails.length > 0) {
      const heroDetailsCollectionIdentifiers = heroDetailsCollection.map(
        heroDetailsItem => this.getHeroDetailsIdentifier(heroDetailsItem)!
      );
      const heroDetailsToAdd = heroDetails.filter(heroDetailsItem => {
        const heroDetailsIdentifier = this.getHeroDetailsIdentifier(heroDetailsItem);
        if (heroDetailsCollectionIdentifiers.includes(heroDetailsIdentifier)) {
          return false;
        }
        heroDetailsCollectionIdentifiers.push(heroDetailsIdentifier);
        return true;
      });
      return [...heroDetailsToAdd, ...heroDetailsCollection];
    }
    return heroDetailsCollection;
  }

  protected convertDateFromClient<T extends IHeroDetails | NewHeroDetails | PartialUpdateHeroDetails>(heroDetails: T): RestOf<T> {
    return {
      ...heroDetails,
      dateOfBirth: heroDetails.dateOfBirth?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restHeroDetails: RestHeroDetails): IHeroDetails {
    return {
      ...restHeroDetails,
      dateOfBirth: restHeroDetails.dateOfBirth ? dayjs(restHeroDetails.dateOfBirth) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestHeroDetails>): HttpResponse<IHeroDetails> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestHeroDetails[]>): HttpResponse<IHeroDetails[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
