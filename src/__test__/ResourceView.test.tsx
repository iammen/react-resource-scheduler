import React from 'react';
import { shallow } from 'enzyme';
import ResourceView from '../ResourceView';
import { ViewTypes } from '../enum';
import DemoData from './DemoData';
import * as AppContext from '../SchedulerContext';
import { SchedulerDataManger } from '../SchedulerDataManager';

describe('<ResourceView />', () => {
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
    const wrapper = shallow(<ResourceView contentScrollbarHeight={24} />);
    expect(wrapper.find('.resource-table')).toBeDefined();
  });
});
