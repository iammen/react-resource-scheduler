import { SchedulerDataManger } from '../SchedulerDataManager';
import { ViewTypes } from '../enum';
import { SchedulerData } from '../ScdulerData';

export const getDateLabel = (
  schedulerData: SchedulerData | SchedulerDataManger,
  viewMode: string,
  startDate: string,
  endDate: string,
) => {
  const start = schedulerData.localeMoment(startDate);
  const end = schedulerData.localeMoment(endDate);
  let dateLabel = start.format('MMM D, YYYY');

  if (
    viewMode === ViewTypes.Week ||
    (start !== end &&
      (viewMode === ViewTypes.Custom1 ||
        viewMode === ViewTypes.Custom2 ||
        viewMode === ViewTypes.Custom3))
  ) {
    dateLabel = `${start.format('MMM D')}-${end.format('D, YYYY')}`;
    if (start.month() !== end.month()) {
      dateLabel = `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`;
    }
    if (start.year() !== end.year()) {
      dateLabel = `${start.format('MMM D, YYYY')}-${end.format('MMM D, YYYY')}`;
    }
  } else if (viewMode === ViewTypes.Month) {
    dateLabel = start.format('MMMM YYYY');
  } else if (viewMode === ViewTypes.Quarter) {
    dateLabel = `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`;
  } else if (viewMode === ViewTypes.Year) {
    dateLabel = start.format('YYYY');
  }

  return dateLabel;
};
