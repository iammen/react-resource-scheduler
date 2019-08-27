import { SchedulerData } from '../ScdulerData';
import { Event } from '../interface';

export const getEventText = (schedulerData: SchedulerData, event: Event) => {
  if (!schedulerData.isEventPerspective) {
    return event.title;
  }

  let eventText = event.title;
  schedulerData.resources.forEach(item => {
    if (item.id === event.resourceId) {
      eventText = item.name;
    }
  });

  return eventText;
};
