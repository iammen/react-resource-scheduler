import { SchedulerDataManger } from '../SchedulerDataManager';
import { TimePeriods } from '../enum';

export const getDateLabel = (
  schedulerData: SchedulerDataManger,
  viewMode: string,
  startDate: string,
  endDate: string,
) => {
  const start = schedulerData.localeMoment(startDate);
  const end = schedulerData.localeMoment(endDate);
  let dateLabel = start.format('MMM D, YYYY');

  if (viewMode === TimePeriods.Week || start !== end) {
    dateLabel = `${start.format('MMM D')}-${end.format('D, YYYY')}`;
    if (start.month() !== end.month()) {
      dateLabel = `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`;
    }
    if (start.year() !== end.year()) {
      dateLabel = `${start.format('MMM D, YYYY')}-${end.format('MMM D, YYYY')}`;
    }
  } else if (viewMode === TimePeriods.Month) {
    dateLabel = start.format('MMMM YYYY');
  } else if (viewMode === TimePeriods.Quarter) {
    dateLabel = `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`;
  } else if (viewMode === TimePeriods.Year) {
    dateLabel = start.format('YYYY');
  }

  return dateLabel;
};
