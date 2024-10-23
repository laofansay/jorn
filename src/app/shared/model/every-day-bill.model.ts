import dayjs from 'dayjs';
import { TransactionType } from 'app/shared/model/enumerations/transaction-type.model';
import { Born } from 'app/shared/model/enumerations/born.model';

export interface IEveryDayBill {
  id?: number;
  num?: string;
  amount?: number;
  company?: string;
  driver?: string;
  transactionType?: keyof typeof TransactionType;
  customer?: string;
  voids?: number | null;
  check?: number | null;
  zelle?: number | null;
  cash?: number | null;
  born?: keyof typeof Born | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  updatedBy?: string | null;
  updatedDate?: dayjs.Dayjs | null;
}

export const defaultValue: Readonly<IEveryDayBill> = {};
