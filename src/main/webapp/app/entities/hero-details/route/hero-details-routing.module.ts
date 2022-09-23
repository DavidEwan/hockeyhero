import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HeroDetailsComponent } from '../list/hero-details.component';
import { HeroDetailsDetailComponent } from '../detail/hero-details-detail.component';
import { HeroDetailsUpdateComponent } from '../update/hero-details-update.component';
import { HeroDetailsRoutingResolveService } from './hero-details-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const heroDetailsRoute: Routes = [
  {
    path: '',
    component: HeroDetailsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HeroDetailsDetailComponent,
    resolve: {
      heroDetails: HeroDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HeroDetailsUpdateComponent,
    resolve: {
      heroDetails: HeroDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HeroDetailsUpdateComponent,
    resolve: {
      heroDetails: HeroDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(heroDetailsRoute)],
  exports: [RouterModule],
})
export class HeroDetailsRoutingModule {}
