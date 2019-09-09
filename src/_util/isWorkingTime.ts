import { CellUnits } from '../enum';
import moment from 'moment';

export const isWorkingTime = (checkedTime: moment.Moment, cellUnit: number) => {
  if (cellUnit === CellUnits.Hour) {
    const hour = checkedTime.hour();
    if (hour < 8 || hour > 17) {
      return false;
    }
  } else {
    const dayOfWeek = checkedTime.weekday();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }
  }

  return true;
};
