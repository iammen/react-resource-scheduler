import React from 'react';
import { mount, shallow } from 'enzyme';
import DataHeaderView from '../DataHeaderView';
import * as OurContext from '../SchedulerContext';
import { TimePeriods } from '../enum';
import DemoData from './DemoData';
import { SchedulerDataManger } from '../SchedulerDataManager';

describe('DataHeaderView with SchedulerContext', () => {
  const styles = {
    cellWidth: 40,
    headerHeight: 40,
    rowHeight: 40,
  };

  // https://medium.com/7shifts-engineering-blog/testing-usecontext-react-hook-with-enzyme-shallow-da062140fc83
  it('it should mock with context', () => {
    const schedulerData = new SchedulerDataManger({
      currentDate: '2017-12-18',
      timePeriod: 'week',
      resources: DemoData.resources,
      events: DemoData.events,
      language: 'th',
    });
    const contextValues = {
      source: schedulerData.getSource(),
      styles,
    };
    jest.spyOn(OurContext, 'useSchedulerContext').mockImplementation(() => contextValues);
    const wrapper = shallow(<DataHeaderView height={800} width={1024} />);
    expect(wrapper.find('.header-text')).toHaveLength(7);
  });

  it('it should rendered header 7 times', () => {
    const schedulerData = new SchedulerDataManger({
      currentDate: '2017-12-18',
      timePeriod: 'week',
      resources: DemoData.resources,
      events: DemoData.events,
      language: 'th',
    });
    const TestWithContextComp = () => {
      return (
        <OurContext.SchedulerContext.Provider value={{ source: schedulerData.getSource() }}>
          <DataHeaderView width={1024} height={800} />
        </OurContext.SchedulerContext.Provider>
      );
    };

    const wrapper = mount(<TestWithContextComp />);
    expect(wrapper.find('.header-text')).toHaveLength(7);
  });
});
