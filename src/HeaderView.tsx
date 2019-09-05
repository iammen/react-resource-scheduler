import React from 'react';
import * as PropTypes from 'prop-types';
import { CellUnits } from './enum';
import { useSchedulerContext } from './SchedulerContext';

export interface HeaderViewProps {
  format?: string;
  height: number;
  width: number;
}

const HeaderView: React.FC<HeaderViewProps> = props => {
  const contextValue = useSchedulerContext();

  if (contextValue.styles && contextValue.source) {
    const { headers, cellUnit, config, localeMoment } = contextValue.source;
    const { format, height, width } = props;
    const minuteStepsInHour = contextValue.source.getMinuteStepsInHour();

    let headerList = [];
    let style = {};
    if (cellUnit === CellUnits.Hour) {
      headerList = headers.map((header, index) => {
        if (index % minuteStepsInHour === 0) {
          const datetime = localeMoment(header.time);
          const isCurrentTime = datetime.isSame(new Date(), 'hour');

          style = !header.workingTime
            ? {
                width: width * minuteStepsInHour,
              }
            : { width: width * minuteStepsInHour };

          if (index === headers.length - minuteStepsInHour) {
            style = {};
          }

          const textFormats = format ? format.split('\n').map(f => datetime.format(f)) : [];
          const pList = textFormats.map((str, i) => <div key={i}>{str}</div>);

          return (
            <th
              key={header.time}
              className={`header-text ${header.workingTime ? 'bg-normal' : 'bg-highlight'}`}
              style={style}
            >
              <div>{pList}</div>
            </th>
          );
        }
      });
    } else {
      headerList = headers.map((header, index) => {
        const datetime = localeMoment(header.time);
        style = !header.workingTime
          ? {
              width,
              color: config.nonWorkingTimeHeadColor,
              backgroundColor: config.nonWorkingTimeHeadBgColor,
            }
          : { width };
        if (index === headers.length - 1) {
          style = !header.workingTime
            ? {
                color: config.nonWorkingTimeHeadColor,
                backgroundColor: config.nonWorkingTimeHeadBgColor,
              }
            : {};
        }

        const textFormats = format ? format.split('\n').map(f => datetime.format(f)) : [];
        const pList = textFormats.map((txt, i) => <div key={i}>{txt}</div>);

        return (
          <th
            key={header.time}
            className={`header-text ${header.workingTime ? 'bg-normal' : 'bg-highlight'}`}
            style={style}
          >
            <div>{pList}</div>
          </th>
        );
      });
    }

    return (
      <table className="scheduler-header-table">
        <thead>
          <tr style={{ height }}>{headerList}</tr>
        </thead>
      </table>
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
