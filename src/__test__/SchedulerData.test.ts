import { SchedulerData } from '../ScdulerData';
import { TimePeriods } from '../enum';
import DemoData from './DemoData';

test('Test SchedulerData.initializeSlotRenderData method', () => {
  const schedulerData = new SchedulerData('2017-12-18', TimePeriods.Month);
  schedulerData.setEvents(DemoData.events);
  schedulerData.setResources(DemoData.resources);

  expect(schedulerData).toBeInstanceOf(SchedulerData);
});
