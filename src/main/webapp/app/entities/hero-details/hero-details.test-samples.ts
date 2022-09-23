import dayjs from 'dayjs/esm';

import { IHeroDetails, NewHeroDetails } from './hero-details.model';

export const sampleWithRequiredData: IHeroDetails = {
  id: 73376,
};

export const sampleWithPartialData: IHeroDetails = {
  id: 38989,
  dateOfBirth: dayjs('2022-09-21'),
  streetAddress: 'workforce',
  stateProvince: 'archive Credit Pizza',
};

export const sampleWithFullData: IHeroDetails = {
  id: 52098,
  phone: '589.479.5202',
  dateOfBirth: dayjs('2022-09-22'),
  streetAddress: 'bus',
  city: 'Wisozkborough',
  stateProvince: 'calculate',
  postalCode: 'Applications channels Towels',
};

export const sampleWithNewData: NewHeroDetails = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
