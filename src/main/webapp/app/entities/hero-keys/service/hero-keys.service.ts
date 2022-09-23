import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHeroKeys, NewHeroKeys } from '../hero-keys.model';

export type PartialUpdateHeroKeys = Partial<IHeroKeys> & Pick<IHeroKeys, 'id'>;

export type EntityResponseType = HttpResponse<IHeroKeys>;
export type EntityArrayResponseType = HttpResponse<IHeroKeys[]>;

@Injectable({ providedIn: 'root' })
export class HeroKeysService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/hero-keys');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(heroKeys: NewHeroKeys): Observable<EntityResponseType> {
    return this.http.post<IHeroKeys>(this.resourceUrl, heroKeys, { observe: 'response' });
  }

  update(heroKeys: IHeroKeys): Observable<EntityResponseType> {
    return this.http.put<IHeroKeys>(`${this.resourceUrl}/${this.getHeroKeysIdentifier(heroKeys)}`, heroKeys, { observe: 'response' });
  }

  partialUpdate(heroKeys: PartialUpdateHeroKeys): Observable<EntityResponseType> {
    return this.http.patch<IHeroKeys>(`${this.resourceUrl}/${this.getHeroKeysIdentifier(heroKeys)}`, heroKeys, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHeroKeys>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHeroKeys[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHeroKeysIdentifier(heroKeys: Pick<IHeroKeys, 'id'>): number {
    return heroKeys.id;
  }

  compareHeroKeys(o1: Pick<IHeroKeys, 'id'> | null, o2: Pick<IHeroKeys, 'id'> | null): boolean {
    return o1 && o2 ? this.getHeroKeysIdentifier(o1) === this.getHeroKeysIdentifier(o2) : o1 === o2;
  }

  addHeroKeysToCollectionIfMissing<Type extends Pick<IHeroKeys, 'id'>>(
    heroKeysCollection: Type[],
    ...heroKeysToCheck: (Type | null | undefined)[]
  ): Type[] {
    const heroKeys: Type[] = heroKeysToCheck.filter(isPresent);
    if (heroKeys.length > 0) {
      const heroKeysCollectionIdentifiers = heroKeysCollection.map(heroKeysItem => this.getHeroKeysIdentifier(heroKeysItem)!);
      const heroKeysToAdd = heroKeys.filter(heroKeysItem => {
        const heroKeysIdentifier = this.getHeroKeysIdentifier(heroKeysItem);
        if (heroKeysCollectionIdentifiers.includes(heroKeysIdentifier)) {
          return false;
        }
        heroKeysCollectionIdentifiers.push(heroKeysIdentifier);
        return true;
      });
      return [...heroKeysToAdd, ...heroKeysCollection];
    }
    return heroKeysCollection;
  }
}
