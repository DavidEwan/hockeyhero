import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHeroDetails } from '../hero-details.model';
import { HeroDetailsService } from '../service/hero-details.service';

@Injectable({ providedIn: 'root' })
export class HeroDetailsRoutingResolveService implements Resolve<IHeroDetails | null> {
  constructor(protected service: HeroDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHeroDetails | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((heroDetails: HttpResponse<IHeroDetails>) => {
          if (heroDetails.body) {
            return of(heroDetails.body);
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
