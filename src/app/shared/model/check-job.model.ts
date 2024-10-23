export interface ICheckJob {
  id?: number;
  jobName?: string;
  tag?: string;
  rootFolderName?: string;
  rootFolderId?: string;
}

export const defaultValue: Readonly<ICheckJob> = {};
