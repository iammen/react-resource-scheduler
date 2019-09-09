import { Event } from '../interface';
import { SchedulerDataManger, YAxisDataType } from '../SchedulerDataManager';
import { YAxisDataTypes } from '../enum';

export const getEventText = (schedulerData: SchedulerDataManger, event: Event) => {
  if (schedulerData.yAxisDataType === YAxisDataTypes.Event) {
    return event.text;
  }

  let eventText = event.text;
  schedulerData.resources.forEach(item => {
    if (item.id === event.resourceId) {
      eventText = item.text;
    }
  });

  return eventText;
};
