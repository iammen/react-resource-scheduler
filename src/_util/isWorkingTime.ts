import { CellUnits } from '../enum';
import moment from 'moment';

export const isWorkingTime = (time: string, localeMoment: typeof moment, cellUnit: number) => {
  if (cellUnit === CellUnits.Hour) {
    const hour = localeMoment(time).hour();
    if (hour < 8 || hour > 17) {
      return false;
    }
  } else {
    const dayOfWeek = localeMoment(time).weekday();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }
  }

  return true;
};
