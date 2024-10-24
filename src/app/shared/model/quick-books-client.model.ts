import dayjs from "dayjs";
import { IQuickBooksToken } from "app/shared/model/quick-books-token.model";

export interface IQuickBooksClient {
  id?: number;
  tag?: string | null;
  clientId?: string;
  clientSecret?: string;
  companyId?: string;
  companyName?: string;
  authorizationCode?: string | null;
  realmId?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  token?: IQuickBooksToken | null;
}

export const defaultValue: Readonly<IQuickBooksClient> = {};
