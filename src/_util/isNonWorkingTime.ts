import { SchedulerData } from '../ScdulerData';
import { CellUnits } from '../enums';

export const isNonWorkingTime = (schedulerData: SchedulerData, time: string) => {
  const { localeMoment } = schedulerData;

  if (schedulerData.cellUnit === CellUnits.Hour) {
    const hour = localeMoment(time).hour();
    if (hour < 9 || hour > 18) {
      return true;
    }
  } else {
    const dayOfWeek = localeMoment(time).weekday();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true;
    }
  }

  return false;
};
