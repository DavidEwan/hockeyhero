import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HeroKeysComponent } from '../list/hero-keys.component';
import { HeroKeysDetailComponent } from '../detail/hero-keys-detail.component';
import { HeroKeysUpdateComponent } from '../update/hero-keys-update.component';
import { HeroKeysRoutingResolveService } from './hero-keys-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const heroKeysRoute: Routes = [
  {
    path: '',
    component: HeroKeysComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HeroKeysDetailComponent,
    resolve: {
      heroKeys: HeroKeysRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HeroKeysUpdateComponent,
    resolve: {
      heroKeys: HeroKeysRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HeroKeysUpdateComponent,
    resolve: {
      heroKeys: HeroKeysRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(heroKeysRoute)],
  exports: [RouterModule],
})
export class HeroKeysRoutingModule {}
