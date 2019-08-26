import { SchedulerData } from '../ScdulerData';

// Why use this?
export const getScrollSpecialMoment = (schedulerData: SchedulerData, startMoment: any, endMoment: any) => {
  // return endMoment;
  const { localeMoment } = schedulerData;
  return localeMoment();
};
