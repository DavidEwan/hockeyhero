import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHeroKeys } from '../hero-keys.model';
import { HeroKeysService } from '../service/hero-keys.service';

@Injectable({ providedIn: 'root' })
export class HeroKeysRoutingResolveService implements Resolve<IHeroKeys | null> {
  constructor(protected service: HeroKeysService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHeroKeys | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((heroKeys: HttpResponse<IHeroKeys>) => {
          if (heroKeys.body) {
            return of(heroKeys.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
