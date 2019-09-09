import React from 'react';
import moment from 'moment';
import Scheduler from '../src/Scheduler';
import DemoData from '../src/__test__/DemoData';
import { TimePeriods } from '../src/enum';
import { SchedulerDataManger } from '../src/SchedulerDataManager';

interface Props {
  value?: string;
}

export default class Basic extends React.Component<Props, {}> {
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
    if (schedulerData.timePeriod === TimePeriods.Day) {
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
    if (schedulerData.timePeriod === TimePeriods.Day) {
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
          currentDate="2017-12-18"
          events={DemoData.events}
          resources={DemoData.resources}
          timePeriod="day"
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
