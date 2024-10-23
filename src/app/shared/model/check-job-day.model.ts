import dayjs from 'dayjs';
import { ICheckJob } from 'app/shared/model/check-job.model';
import { JobStatus } from 'app/shared/model/enumerations/job-status.model';

export interface ICheckJobDay {
  id?: number;
  day?: string;
  num?: number;
  parentFolderName?: string;
  parentFolderId?: string;
  success?: number;
  ignore?: number;
  resultFileName?: string | null;
  resultFileId?: string | null;
  jobStatus?: keyof typeof JobStatus;
  jobMsg?: string;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  checkJob?: ICheckJob | null;
}

export const defaultValue: Readonly<ICheckJobDay> = {};
