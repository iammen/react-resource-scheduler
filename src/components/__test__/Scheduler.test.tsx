import React from 'react';
import renderer from 'react-test-renderer';
import Scheduler from '../Scheduler';
import { SchedulerData } from '../../ScdulerData';
import DemoData from '../../../example/DemoData';
import { ViewTypes } from '../../enum';

test('Scheduler component should render', () => {
  const schedulerData = new SchedulerData('2017-12-18', ViewTypes.Week);
  schedulerData.localeMoment.locale('en');
  schedulerData.setResources(DemoData.resources);
  schedulerData.setEvents(DemoData.events);
  const component = renderer.create(<Scheduler dataSource={schedulerData} width="100%" />);
  const testInstance = component.root;

  expect(testInstance.findByType(Scheduler).props.text).toBe('World');
});
