import { SchedulerData } from '../ScdulerData';

export const getEventText = (schedulerData: SchedulerData, event: any) => {
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
