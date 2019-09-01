import React from 'react';
import * as PropTypes from 'prop-types';
import { CellUnits } from '../enum';
import { useSchedulerContext } from '../SchedulerContext';

export interface HeaderViewProps {
  format?: string;
  height: number;
  width: number;
}

const HeaderView: React.FC<HeaderViewProps> = props => {
  const context = useSchedulerContext();

  if (context.styles && context.source) {
    const { headers, cellUnit, config, localeMoment } = context.source;
    const { format, height, width } = props;
    const minuteStepsInHour = context.source.getMinuteStepsInHour();

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
        const pList = textFormats.map((txt, i) => <div key={i}>{txt}</div>);

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
};

HeaderView.propTypes = {
  format: PropTypes.string,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

HeaderView.defaultProps = {
  format: 'ddd M/D',
};

export default HeaderView;
