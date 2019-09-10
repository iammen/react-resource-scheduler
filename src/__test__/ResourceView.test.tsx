import React from 'react';
import { shallow } from 'enzyme';
import ResourceView from '../ResourceView';
import DemoData from './DemoData';
import * as AppContext from '../SchedulerContext';
import { SchedulerDataManger } from '../SchedulerDataManager';

describe('<ResourceView />', () => {
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
    const wrapper = shallow(<ResourceView scrollbarHeight={24} />);
    expect(wrapper.find('.rss_resource_table')).toBeDefined();
  });
});
