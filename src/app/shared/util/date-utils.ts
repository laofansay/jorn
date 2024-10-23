import dayjs from 'dayjs'

export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm'

export const convertDateTimeFromServer = (date) =>
   date ? dayjs(date).format(APP_LOCAL_DATETIME_FORMAT) : null

export const convertDateTimeToServer = (date?: string): dayjs.Dayjs | null =>
   date ? dayjs(date) : null

export const displayDefaultDateTime = () =>
   dayjs().startOf('day').format(APP_LOCAL_DATETIME_FORMAT)
