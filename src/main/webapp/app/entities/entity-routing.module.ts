import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'hero-keys',
        data: { pageTitle: 'hockeyheroApp.heroKeys.home.title' },
        loadChildren: () => import('./hero-keys/hero-keys.module').then(m => m.HeroKeysModule),
      },
      {
        path: 'hero-details',
        data: { pageTitle: 'hockeyheroApp.heroDetails.home.title' },
        loadChildren: () => import('./hero-details/hero-details.module').then(m => m.HeroDetailsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
