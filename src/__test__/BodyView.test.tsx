import React from 'react';
import { mount, shallow } from 'enzyme';
import BodyView from '../BodyView';
import * as AppContext from '../SchedulerContext';
import DemoData from './DemoData';
import { SchedulerDataManger } from '../SchedulerDataManager';

describe('<BodyView />', () => {
  const styles = {
    cellWidth: 40,
    headerHeight: 40,
    rowHeight: 40,
  };

  it('it should mock with context', () => {
    const schedulerData = new SchedulerDataManger({
      currentDate: '2017-12-18',
      viewType: 'week',
      resources: DemoData.resources,
      events: DemoData.events,
      language: 'th',
    });
    const contextValue = {
      source: schedulerData.getSource(),
      styles,
    };

    jest.spyOn(AppContext, 'useSchedulerContext').mockImplementation(() => contextValue);
    const wrapper = shallow(<BodyView width={24} />);
    expect(wrapper.find('tbody')).toBeDefined();
  });
});
