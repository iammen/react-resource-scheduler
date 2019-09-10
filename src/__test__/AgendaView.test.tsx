import React from 'react';
import { mount } from 'enzyme';
import AgendaView from '../AgendaView';
import DemoData from './DemoData';
import * as AppContext from '../SchedulerContext';
import { SchedulerDataManger } from '../SchedulerDataManager';

describe('<AgendaView />', () => {
  const styles = {
    cellWidth: 40,
    headerHeight: 40,
    rowMaxHeight: 0,
    rowHeight: 40,
  };

  it('it should mock with context', () => {
    const schedulerData = new SchedulerDataManger({
      currentDate: '2017-12-18',
      timePeriod: 'week',
      resources: DemoData.resources,
      events: DemoData.events,
      language: 'th',
    });
    const contextValue = {
      source: schedulerData.getSource(),
      styles,
    };

    jest.spyOn(AppContext, 'useSchedulerContext').mockImplementation(() => contextValue);
    const wrapper = mount(<AgendaView />);
    expect(wrapper.find('.header3-text').text()).toEqual('Resource Name');
  });
});
