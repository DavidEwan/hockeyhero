import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHeroDetails } from '../hero-details.model';

@Component({
  selector: 'jhi-hero-details-detail',
  templateUrl: './hero-details-detail.component.html',
})
export class HeroDetailsDetailComponent implements OnInit {
  heroDetails: IHeroDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ heroDetails }) => {
      this.heroDetails = heroDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
