import { IHeroDetails } from 'app/entities/hero-details/hero-details.model';

export interface IHeroKeys {
  id: number;
  hideMe?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  age?: number | null;
  myPosition?: number | null;
  skill?: number | null;
  heroDetails?: Pick<IHeroDetails, 'id'> | null;
}

export type NewHeroKeys = Omit<IHeroKeys, 'id'> & { id: null };
