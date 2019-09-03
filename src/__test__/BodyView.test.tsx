import React from 'react';
import { mount, shallow } from 'enzyme';
import BodyView from '../BodyView';
import * as AppContext from '../SchedulerContext';
import { SchedulerData } from '../ScdulerData';
import { ViewTypes } from '../enum';
import DemoData from './DemoData';

describe('<BodyView />', () => {
  const styles = {
    cellWidth: 40,
    headerHeight: 40,
    maxHeight: 0,
    slotHeaderWidth: 160,
    slotHeight: 40,
  };

  it('it should mock with context', () => {
    const schedulerData = new SchedulerData('2017-12-08', ViewTypes.Week);
    schedulerData.localeMoment.locale('th');
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.events);
    const contextValue = {
      source: schedulerData,
      styles,
    };

    jest.spyOn(AppContext, 'useSchedulerContext').mockImplementation(() => contextValue);
    const wrapper = shallow(<BodyView cellWidth={24} />);
    expect(wrapper.find('tbody')).toBeDefined();
  });
});
