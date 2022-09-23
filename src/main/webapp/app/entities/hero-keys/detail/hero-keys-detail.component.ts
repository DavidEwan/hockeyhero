import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHeroKeys } from '../hero-keys.model';

@Component({
  selector: 'jhi-hero-keys-detail',
  templateUrl: './hero-keys-detail.component.html',
})
export class HeroKeysDetailComponent implements OnInit {
  heroKeys: IHeroKeys | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ heroKeys }) => {
      this.heroKeys = heroKeys;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
