import { SchedulerData } from '../ScdulerData';
import { ViewTypes } from '../enums';
import DemoData from '../example/DemoData';

test('Test SchedulerData.initializeSlotRenderData method', () => {
  const schedulerData = new SchedulerData('2017-12-18', ViewTypes.Month);
  schedulerData.setEvents(DemoData.events);
  schedulerData.setResources(DemoData.resources);

  expect(schedulerData).toBeInstanceOf(SchedulerData);
});
