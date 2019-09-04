import React from 'react';
import moment from 'moment';
import Scheduler from '../src/Scheduler';
import DemoData from '../src/__test__/DemoData';
import { SchedulerData } from '../src/ScdulerData';
import { ViewTypes } from '../src/enum';
import { SchedulerDataManger } from '../src/SchedulerDataManager';

interface Props {
  value?: string;
}

export default class Basic extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    const schedulerData = new SchedulerData('2017-12-18', ViewTypes.Week);
    schedulerData.localeMoment.locale('en');
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.events);
  }

  onSelectDate = (schedulerData: SchedulerDataManger, date: moment.Moment) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(DemoData.events);
  };

  eventClicked = (schedulerData: SchedulerDataManger, event: any) => {
    alert(`You just clicked an event: {id: ${event.id}, text: ${event.text}}`);
  };

  onScrollRight = (
    schedulerData: SchedulerDataManger,
    schedulerContent: React.RefObject<HTMLDivElement>,
    maxScrollLeft: number,
  ) => {
    if (schedulerData.viewType === ViewTypes.Day) {
      schedulerData.setEvents(DemoData.events);
      if (schedulerContent.current) {
        schedulerContent.current.scrollLeft = maxScrollLeft - 10;
      }
    }
  };

  onScrollLeft = (
    schedulerData: SchedulerDataManger,
    schedulerContent: React.RefObject<HTMLDivElement>,
    maxScrollLeft: number,
  ) => {
    if (schedulerData.viewType === ViewTypes.Day) {
      // schedulerData.prev();
      schedulerData.setEvents(DemoData.events);

      if (schedulerContent.current) {
        schedulerContent.current.scrollLeft = 10;
      }
    }
  };

  onScrollTop = (
    schedulerData: SchedulerDataManger,
    schedulerContent: React.RefObject<HTMLDivElement>,
    maxScrollTop: number,
  ) => {
    console.log('onScrollTop');
  };

  onScrollBottom = (
    schedulerData: SchedulerDataManger,
    schedulerContent: React.RefObject<HTMLDivElement>,
    maxScrollTop: number,
  ) => {
    console.log('onScrollBottom');
  };

  render() {
    return (
      <div style={{ padding: 10, position: 'relative' }}>
        <h3 style={{ textAlign: 'center' }}>Basic example</h3>
        <Scheduler
          events={DemoData.events}
          resources={DemoData.resources}
          viewType="week"
          onSelectDate={this.onSelectDate}
          onScrollLeft={this.onScrollLeft}
          onScrollRight={this.onScrollRight}
          onScrollTop={this.onScrollTop}
          onScrollBottom={this.onScrollBottom}
        />
      </div>
    );
  }
}
