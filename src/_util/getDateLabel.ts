import { SchedulerData } from '../ScdulerData';
import { ViewTypes } from '../enums';

export const getDateLabel = (schedulerData: SchedulerData, viewType: number, startDate: string, endDate: string) => {
  const start = schedulerData.localeMoment(startDate);
  const end = schedulerData.localeMoment(endDate);
  let dateLabel = start.format('MMM D, YYYY');

  if (
    viewType === ViewTypes.Week ||
    (start !== end &&
      (viewType === ViewTypes.Custom || viewType === ViewTypes.Custom1 || viewType === ViewTypes.Custom2))
  ) {
    dateLabel = `${start.format('MMM D')}-${end.format('D, YYYY')}`;
    if (start.month() !== end.month()) {
      dateLabel = `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`;
    }
    if (start.year() !== end.year()) {
      dateLabel = `${start.format('MMM D, YYYY')}-${end.format('MMM D, YYYY')}`;
    }
  } else if (viewType === ViewTypes.Month) {
    dateLabel = start.format('MMMM YYYY');
  } else if (viewType === ViewTypes.Quarter) {
    dateLabel = `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`;
  } else if (viewType === ViewTypes.Year) {
    dateLabel = start.format('YYYY');
  }

  return dateLabel;
};
