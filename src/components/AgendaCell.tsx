import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Popover from 'antd/lib/popover';
import 'antd/lib/popover/style/index.css';
import EventItemPopover from './EventPopover';
import { getEventText } from '../_util/getEventText';
import { Event } from '../interface';
import { SchedulerContext } from '../SchedulerContext';

export interface AgendaCellProps {
  defaultValue: Event;
  isEnd: boolean;
  isStart: boolean;
}

export default class AgendaCell extends Component<AgendaCellProps, {}> {
  static propTypes = {
    defaultValue: PropTypes.object.isRequired,
    isStart: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
  };

  render() {
    const { defaultValue, isStart, isEnd } = this.props;

    return (
      <SchedulerContext.Consumer>
        {value => {
          if (value.source && value.styles) {
            const { config } = value.source;
            const roundCls = isStart
              ? isEnd
                ? 'round-all'
                : 'round-head'
              : isEnd
              ? 'round-tail'
              : 'round-none';
            let bgColor = config.defaultEventBgColor;
            if (!!defaultValue.bgColor) {
              bgColor = defaultValue.bgColor;
            }

            const titleText = getEventText(value.source, defaultValue);
            const content = (
              <EventItemPopover
                {...this.props}
                title={defaultValue.title}
                startTime={defaultValue.start}
                endTime={defaultValue.end}
                statusColor={bgColor}
              />
            );
            const eventTemplate = (
              <div
                className={roundCls + ' event-item'}
                key={defaultValue.id}
                style={{
                  height: config.eventItemHeight,
                  maxWidth: config.agendaMaxEventWidth,
                  backgroundColor: bgColor,
                }}
              >
                <span style={{ marginLeft: '10px', lineHeight: `${config.eventItemHeight}px` }}>
                  {titleText}
                </span>
              </div>
            );

            return (
              <Popover placement="bottomLeft" content={content} trigger="hover">
                <a className="day-event">{eventTemplate}</a>
              </Popover>
            );
          } else {
            return null;
          }
        }}
      </SchedulerContext.Consumer>
    );
  }
}
