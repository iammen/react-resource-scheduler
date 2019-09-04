import { SchedulerData } from '../ScdulerData';
import { Event } from '../interface';
import { SchedulerDataManger } from '../SchedulerDataManager';

export const getEventText = (schedulerData: SchedulerData | SchedulerDataManger, event: Event) => {
  if (!schedulerData.isEventPerspective) {
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
