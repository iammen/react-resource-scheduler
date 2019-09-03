import React from 'react';
import moment from 'moment';
import Scheduler from '../src/components/Scheduler';
import DemoData from '../src/__test__/DemoData';
import { SchedulerData } from '../src/ScdulerData';
import { ViewTypes } from '../src/enum';

interface Props {
  value?: string;
}

interface States {
  dataSource: SchedulerData;
}

export default class Basic extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);

    const schedulerData = new SchedulerData('2017-12-18', ViewTypes.Week);
    schedulerData.localeMoment.locale('en');
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.events);
    this.state = {
      dataSource: schedulerData,
    };
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div>
        <div>
          <h3 style={{ textAlign: 'center' }}>Basic example</h3>
          <Scheduler
            dataSource={dataSource}
            onSelectDate={this.onSelectDate}
            onScrollLeft={this.onScrollLeft}
            onScrollRight={this.onScrollRight}
            onScrollTop={this.onScrollTop}
            onScrollBottom={this.onScrollBottom}
          />
        </div>
      </div>
    );
  }

  onSelectDate = (schedulerData: SchedulerData, date: moment.Moment) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(DemoData.events);
    this.setState({
      dataSource: schedulerData,
    });
  };

  eventClicked = (schedulerData: SchedulerData, event: any) => {
    alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
  };

  onScrollRight = (
    schedulerData: SchedulerData,
    schedulerContent: React.RefObject<HTMLDivElement>,
    maxScrollLeft: number,
  ) => {
    if (schedulerData.viewType === ViewTypes.Day) {
      schedulerData.setEvents(DemoData.events);
      this.setState({
        dataSource: schedulerData,
      });

      if (schedulerContent.current) {
        schedulerContent.current.scrollLeft = maxScrollLeft - 10;
      }
    }
  };

  onScrollLeft = (
    schedulerData: SchedulerData,
    schedulerContent: React.RefObject<HTMLDivElement>,
    maxScrollLeft: number,
  ) => {
    if (schedulerData.viewType === ViewTypes.Day) {
      // schedulerData.prev();
      schedulerData.setEvents(DemoData.events);
      this.setState({
        dataSource: schedulerData,
      });

      if (schedulerContent.current) {
        schedulerContent.current.scrollLeft = 10;
      }
    }
  };

  onScrollTop = (
    schedulerData: SchedulerData,
    schedulerContent: React.RefObject<HTMLDivElement>,
    maxScrollTop: number,
  ) => {
    console.log('onScrollTop');
  };

  onScrollBottom = (
    schedulerData: SchedulerData,
    schedulerContent: React.RefObject<HTMLDivElement>,
    maxScrollTop: number,
  ) => {
    console.log('onScrollBottom');
  };
}
