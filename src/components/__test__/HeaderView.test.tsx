import React from 'react';
import { mount, shallow } from 'enzyme';
import HeaderView from '../HeaderView';
import { SchedulerData } from '../../ScdulerData';
import * as OurContext from '../../SchedulerContext';
import { ViewTypes } from '../../enum';
import DemoData from '../../../example/DemoData';

describe('HeaderView with SchedulerContext', () => {
  const styles = {
    cellWidth: 40,
    headerHeight: 40,
    maxHeight: 0,
    slotHeaderWidth: 160,
    slotHeight: 40,
  };

  // https://medium.com/7shifts-engineering-blog/testing-usecontext-react-hook-with-enzyme-shallow-da062140fc83
  it('it should mock with context', () => {
    const schedulerData = new SchedulerData('2017-12-18', ViewTypes.Week);
    schedulerData.localeMoment.locale('en');
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.events);
    const contextValues = {
      source: schedulerData,
      styles,
    };
    jest.spyOn(OurContext, 'useSchedulerContext').mockImplementation(() => contextValues);
    const wrapper = shallow(<HeaderView height={800} width={1024} />);
    expect(wrapper.find('.header3-text')).toHaveLength(7);
  });

  it('it should rendered header 7 times', () => {
    const schedulerData = new SchedulerData('2017-12-18', ViewTypes.Week);
    schedulerData.localeMoment.locale('en');
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.events);
    const TestWithContextComp = () => {
      return (
        <OurContext.SchedulerContext.Provider value={{ styles, source: schedulerData }}>
          <HeaderView width={1024} height={800} />
        </OurContext.SchedulerContext.Provider>
      );
    };

    const wrapper = mount(<TestWithContextComp />);
    expect(wrapper.find('.header3-text')).toHaveLength(7);
  });
});
