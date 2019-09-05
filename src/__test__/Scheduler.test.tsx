import React from 'react';
import { mount, shallow } from 'enzyme';
import Scheduler from '../Scheduler';
import DemoData from './DemoData';
import { ViewTypes } from '../enum';
import { SchedulerDataManger } from '../SchedulerDataManager';

describe('<Scheduler />', () => {
  it('it should mock', () => {
    const wrapper = shallow(
      <Scheduler
        currentDate="2017-12-18"
        viewType="week"
        resources={DemoData.resources}
        events={DemoData.events}
        width="100%"
      />,
    );
    expect(wrapper.find('.resource-header')).toBeDefined();
    expect(wrapper.find('.scheduler-bg-table')).toBeDefined();
  });

  describe('props and method', () => {
    it('this.props.viewType should be "week"', () => {
      const wrapper = shallow(
        <Scheduler
          currentDate="2017-12-18"
          viewType="week"
          resources={DemoData.resources}
          events={DemoData.events}
          width="100%"
        />,
      );
      expect((wrapper.instance() as Scheduler).props.viewType).toEqual('week');
    });

    it('this.resolveSchedulerWidth() : it should return 1004 @@@ 1024 (default scheduler width) - 20 (besidewidth) @@@', () => {
      const wrapper = mount(
        <Scheduler
          currentDate="2017-12-18"
          viewType="week"
          resources={DemoData.resources}
          events={DemoData.events}
          width="100%"
        />,
      );
      const instance = wrapper.instance() as Scheduler;
      expect(instance.resolveSchedulerWidth()).toEqual(1004);
    });

    it('this.resolveResourceWidth() : it should return 200', () => {
      const wrapper = shallow(
        <Scheduler
          currentDate="2017-12-18"
          viewType="week"
          resources={DemoData.resources}
          events={DemoData.events}
          width="100%"
        />,
      );
      expect((wrapper.instance() as Scheduler).resolveResourceWidth()).toEqual(200);
    });

    it('this.isResponsive() : it should return true', () => {
      const wrapper = mount(
        <Scheduler
          currentDate="2017-12-18"
          viewType="week"
          resources={DemoData.resources}
          events={DemoData.events}
          width="100%"
        />,
      );
      const instance = wrapper.instance() as Scheduler;
      expect(instance.isResponsive()).toEqual(true);
    });

    it('this.resolveCellWidth() : it should return 120.48 @@@ 1004 (Scheduler width) * 12 (12%) / 100 @@@', () => {
      const wrapper = shallow(
        <Scheduler
          currentDate="2017-12-18"
          viewType="week"
          resources={DemoData.resources}
          events={DemoData.events}
          width="100%"
        />,
      );
      expect((wrapper.instance() as Scheduler).resolveCellWidth()).toEqual(120.48);
    });

    it('this.resolveTotalCellWidth() : it should return 843.36 @@@ 120.48 * 7 @@@', () => {
      const wrapper = shallow(
        <Scheduler
          currentDate="2017-12-18"
          viewType="week"
          resources={DemoData.resources}
          events={DemoData.events}
          width="100%"
        />,
      );
      expect((wrapper.instance() as Scheduler).resolveTotalCellWidth()).toEqual(843.36);
    });
  });
});
