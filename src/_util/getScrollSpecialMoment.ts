import { SchedulerData } from '../ScdulerData';
import { SchedulerDataManger } from '../SchedulerDataManager';

// Why use this?
export const getScrollSpecialMoment = (
  schedulerData: SchedulerData | SchedulerDataManger,
  startMoment: any,
  endMoment: any,
) => {
  // return endMoment;
  const { localeMoment } = schedulerData;
  return localeMoment();
};
