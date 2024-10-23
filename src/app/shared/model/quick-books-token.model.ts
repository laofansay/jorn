import dayjs from 'dayjs';

export interface IQuickBooksToken {
  id?: number;
  refreshToken?: string;
  accessToken?: string;
  expiresIn?: number;
  xRefreshToken?: number;
  authorizationCode?: string;
  idToken?: string;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
}

export const defaultValue: Readonly<IQuickBooksToken> = {};
