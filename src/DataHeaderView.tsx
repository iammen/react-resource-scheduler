import React from 'react';
import * as PropTypes from 'prop-types';
import { CellUnits } from './enum';
import { useSchedulerContext } from './SchedulerContext';
import moment from 'moment';
import { XAxisHeader } from './interface';

export interface DataHeaderViewProps {
  format?: string;
  height: number;
  width: number;
}

const DataHeaderView: React.FC<DataHeaderViewProps> = ({ format, height, width }) => {
  const contextValue = useSchedulerContext();

  const renderHeader = (head: XAxisHeader, locale: typeof moment, headerFormat?: string) => {
    return headerFormat
      ? headerFormat
          .split('\n')
          .map(f => locale(head.time).format(f))
          .map((text, i) => <div key={i}>{text}</div>)
      : [];
  };

  if (contextValue.styles && contextValue.source) {
    const { headers, cellUnit, localeMoment } = contextValue.source;
    const minuteStepsInHour = 1;

    return (
      <table className="rss_data_header_table">
        <thead>
          <tr style={{ height }}>
            {cellUnit === CellUnits.Hour
              ? headers.map((header, index) => {
                  if (index % minuteStepsInHour === 0) {
                    return (
                      <th
                        key={header.time}
                        className={`header-text ${
                          header.workingTime ? 'bg-normal' : 'bg-highlight'
                        }`}
                        style={
                          index === headers.length - minuteStepsInHour
                            ? {}
                            : { width: width * minuteStepsInHour }
                        }
                      >
                        <div>{renderHeader(header, localeMoment, format)}</div>
                      </th>
                    );
                  }
                })
              : headers.map((header, index) => {
                  return (
                    <th
                      key={header.time}
                      className={`header-text ${header.workingTime ? 'bg-normal' : 'bg-highlight'}`}
                      style={index === headers.length - 1 ? {} : { width }}
                    >
                      <div>{renderHeader(header, localeMoment, format)}</div>
                    </th>
                  );
                })}
          </tr>
        </thead>
      </table>
    );
  } else {
    return null;
  }
};

DataHeaderView.propTypes = {
  format: PropTypes.string,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

DataHeaderView.defaultProps = {
  format: 'ddd M/D',
};

export default DataHeaderView;
