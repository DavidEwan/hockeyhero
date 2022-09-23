import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IHeroDetails {
  id: number;
  phone?: string | null;
  dateOfBirth?: dayjs.Dayjs | null;
  streetAddress?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  postalCode?: string | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewHeroDetails = Omit<IHeroDetails, 'id'> & { id: null };
