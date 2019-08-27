import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { CellUnits } from '../enum';
import { SchedulerContext } from '../SchedulerContext';

export interface HeaderViewProps {
  format?: string;
  height: number;
  width: number;
}

export default class HeaderView extends Component<HeaderViewProps, {}> {
  static propTypes = {
    format: PropTypes.string,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    format: 'ddd M/D',
  };

  render() {
    return (
      <SchedulerContext.Consumer>
        {value => {
          if (value.styles && value.source) {
            const { headers, cellUnit, config, localeMoment } = value.source;
            const { format, height, width } = this.props;
            const minuteStepsInHour = value.source.getMinuteStepsInHour();

            let headerList = [];
            let style = {};
            if (cellUnit === CellUnits.Hour) {
              headerList = headers.map((item, index) => {
                if (index % minuteStepsInHour === 0) {
                  const datetime = localeMoment(item.time);
                  const isCurrentTime = datetime.isSame(new Date(), 'hour');

                  style = item.nonWorkingTime
                    ? {
                        width: width * minuteStepsInHour,
                        color: config.nonWorkingTimeHeadColor,
                        backgroundColor: config.nonWorkingTimeHeadBgColor,
                      }
                    : { width: width * minuteStepsInHour };

                  if (index === headers.length - minuteStepsInHour) {
                    style = !!item.nonWorkingTime
                      ? {
                          color: config.nonWorkingTimeHeadColor,
                          backgroundColor: config.nonWorkingTimeHeadBgColor,
                        }
                      : {};
                  }

                  const textFormats = format ? format.split('\n').map(f => datetime.format(f)) : [];
                  const pList = textFormats.map((str, i) => <div key={i}>{str}</div>);

                  return (
                    <th key={item.time} className="header3-text" style={style}>
                      <div>{pList}</div>
                    </th>
                  );
                }
              });
            } else {
              headerList = headers.map((item, index) => {
                const datetime = localeMoment(item.time);
                style = !!item.nonWorkingTime
                  ? {
                      width,
                      color: config.nonWorkingTimeHeadColor,
                      backgroundColor: config.nonWorkingTimeHeadBgColor,
                    }
                  : { width };
                if (index === headers.length - 1) {
                  style = !!item.nonWorkingTime
                    ? {
                        color: config.nonWorkingTimeHeadColor,
                        backgroundColor: config.nonWorkingTimeHeadBgColor,
                      }
                    : {};
                }

                const textFormats = format ? format.split('\n').map(f => datetime.format(f)) : [];
                const pList = textFormats.map((hf, i) => <div key={i}>{item}</div>);

                return (
                  <th key={item.time} className="header3-text" style={style}>
                    <div>{pList}</div>
                  </th>
                );
              });
            }

            return (
              <thead>
                <tr style={{ height }}>{headerList}</tr>
              </thead>
            );
          } else {
            return null;
          }
        }}
      </SchedulerContext.Consumer>
    );
  }
}
