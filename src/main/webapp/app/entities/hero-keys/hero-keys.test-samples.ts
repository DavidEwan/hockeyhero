import { IHeroKeys, NewHeroKeys } from './hero-keys.model';

export const sampleWithRequiredData: IHeroKeys = {
  id: 42953,
};

export const sampleWithPartialData: IHeroKeys = {
  id: 40485,
  hideMe: true,
};

export const sampleWithFullData: IHeroKeys = {
  id: 81112,
  hideMe: true,
  latitude: 39029,
  longitude: 32649,
  age: 75173,
  myPosition: 94012,
  skill: 33618,
};

export const sampleWithNewData: NewHeroKeys = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
