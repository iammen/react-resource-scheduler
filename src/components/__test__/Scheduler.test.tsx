import React from 'react';
import { mount, shallow } from 'enzyme';
import Scheduler from '../Scheduler';
import { SchedulerData } from '../../ScdulerData';
import DemoData from '../../__test__/DemoData';
import { ViewTypes } from '../../enum';

describe('<Scheduler />', () => {
  let dataSource: SchedulerData;

  beforeEach(() => {
    dataSource = new SchedulerData('2017-12-18', ViewTypes.Week);
    dataSource.localeMoment.locale('en');
    dataSource.setResources(DemoData.resources);
    dataSource.setEvents(DemoData.events);
  });

  it('it should mock', () => {
    const wrapper = shallow(<Scheduler dataSource={dataSource} width="100%" />);
    expect(wrapper.find('.scheduler-bg-table')).toBeDefined();
  });

  describe('props', () => {
    it('viewType should be "week"', () => {
      const wrapper = shallow(<Scheduler dataSource={dataSource} width="100%" />);
      expect((wrapper.instance() as Scheduler).props.viewType).toEqual('week');
    });
  });

  describe('getSchedulerWidth()', () => {
    it('it should be 1024 (default scheduler width) - 20 (besidewidth) = 1004', () => {
      const wrapper = mount(<Scheduler dataSource={dataSource} width="100%" />);
      const instance = wrapper.instance() as Scheduler;
      expect(instance.getSchedulerWidth()).toEqual(1004);
    });
  });

  describe('getCellWidht()', () => {
    it('it should be "12%"', () => {
      const wrapper = shallow(<Scheduler dataSource={dataSource} width="100%" />);
      expect((wrapper.instance() as Scheduler).getCellWidth()).toEqual('12%');
    });
  });
});
