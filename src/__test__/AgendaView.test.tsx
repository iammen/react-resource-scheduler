import React from 'react';
import { mount } from 'enzyme';
import AgendaView from '../AgendaView';
import { ViewTypes } from '../enum';
import DemoData from './DemoData';
import * as AppContext from '../SchedulerContext';
import { SchedulerDataManger } from '../SchedulerDataManager';

describe('<AgendaView />', () => {
  const styles = {
    cellWidth: 40,
    headerHeight: 40,
    maxHeight: 0,
    slotHeaderWidth: 160,
    slotHeight: 40,
  };

  it('it should mock with context', () => {
    const schedulerData = new SchedulerDataManger({
      currentDate: '2017-12-18',
      viewType: ViewTypes.Week,
      resources: DemoData.resources,
      events: DemoData.events,
      language: 'th',
    });
    const contextValue = {
      source: schedulerData,
      styles,
    };

    jest.spyOn(AppContext, 'useSchedulerContext').mockImplementation(() => contextValue);
    const wrapper = mount(<AgendaView />);
    expect(wrapper.find('.header3-text').text()).toEqual('Resource Name');
  });
});
