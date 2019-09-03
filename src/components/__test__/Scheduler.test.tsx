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
    expect(wrapper.find('.resource-header')).toBeDefined();
    expect(wrapper.find('.scheduler-bg-table')).toBeDefined();
  });

  describe('props and method', () => {
    it('this.props.viewType should be "week"', () => {
      const wrapper = shallow(<Scheduler dataSource={dataSource} width="100%" />);
      expect((wrapper.instance() as Scheduler).props.viewType).toEqual('week');
    });

    it('this.getSchedulerWidth() : it should return 1004 @@@ 1024 (default scheduler width) - 20 (besidewidth) @@@', () => {
      const wrapper = mount(<Scheduler dataSource={dataSource} width="100%" />);
      const instance = wrapper.instance() as Scheduler;
      expect(instance.getSchedulerWidth()).toEqual(1004);
    });

    it('this.getResourceWidth() : it should return 200', () => {
      const wrapper = shallow(<Scheduler dataSource={dataSource} width="100%" />);
      expect((wrapper.instance() as Scheduler).getResourceWidth()).toEqual(200);
    });

    it('this.isResponsive() : it should return true', () => {
      const wrapper = mount(<Scheduler dataSource={dataSource} width="100%" />);
      const instance = wrapper.instance() as Scheduler;
      expect(instance.isResponsive()).toEqual(true);
    });

    it('this.getCellWidht() : it should return 120.48 @@@ 1004 (Scheduler width) * 12 (12%) / 100 @@@', () => {
      const wrapper = shallow(<Scheduler dataSource={dataSource} width="100%" />);
      expect((wrapper.instance() as Scheduler).getCellWidth()).toEqual(120.48);
    });

    it('this.getTotalCellWidth() : it should return 843.36 @@@ 120.48 * 7 @@@', () => {
      const wrapper = shallow(<Scheduler dataSource={dataSource} width="100%" />);
      expect((wrapper.instance() as Scheduler).getTotalCellWidth()).toEqual(843.36);
    });
  });
});
