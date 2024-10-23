import dayjs from 'dayjs';
import { ICheckJobDay } from 'app/shared/model/check-job-day.model';
import { JobStatus } from 'app/shared/model/enumerations/job-status.model';

export interface ICheckJobLog {
  id?: number;
  fileName?: string;
  fileType?: string;
  sourceUrl?: string;
  sourceFileId?: string;
  targetUrl?: string | null;
  targetFileId?: string | null;
  status?: keyof typeof JobStatus;
  log?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  updatedBy?: string | null;
  updatedDate?: dayjs.Dayjs | null;
  checkJobDay?: ICheckJobDay | null;
}

export const defaultValue: Readonly<ICheckJobLog> = {};
