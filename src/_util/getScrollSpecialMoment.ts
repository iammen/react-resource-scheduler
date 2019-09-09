import { SchedulerDataManger } from '../SchedulerDataManager';

// Why use this?
export const getScrollSpecialMoment = (
  schedulerData: SchedulerDataManger,
  startMoment: any,
  endMoment: any,
) => {
  // return endMoment;
  const { localeMoment } = schedulerData;
  return localeMoment();
};
