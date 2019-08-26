import { SchedulerData } from '../ScdulerData';
import { CellUnits } from '../enums';
import moment from 'moment';

export const isNonWorkingTime = (time: string, localeMoment: typeof moment, cellUnit: number) => {
  if (cellUnit === CellUnits.Hour) {
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
