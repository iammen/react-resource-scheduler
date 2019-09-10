import React from 'react';
import * as PropTypes from 'prop-types';
import { useSchedulerContext } from './SchedulerContext';
import moment from 'moment';
import { XAxis } from './interface';

export interface DataHeaderViewProps {
  format?: string;
  height: number;
  width: number;
}

const DataHeaderView: React.FC<DataHeaderViewProps> = ({ format, height, width }) => {
  const contextValue = useSchedulerContext();

  const renderHeader = (x: XAxis, locale: typeof moment, headerFormat?: string) => {
    return headerFormat
      ? headerFormat
          .split('\n')
          .map(f => locale(x.startTime).format(f))
          .map((text, i) => <div key={i}>{text}</div>)
      : [];
  };

  if (contextValue.source) {
    const { xAxis, localeMoment } = contextValue.source;
    const minuteStepsInHour = 1;

    return (
      <table className="rss_data_header_table">
        <thead>
          <tr style={{ height }}>
            {xAxis.map((x, index) => {
              return (
                <th
                  key={index}
                  className={`header-text ${x.workingTime ? 'bg-normal' : 'bg-highlight'}`}
                  style={x.length > 0 ? { width: x.length } : {}}
                >
                  {renderHeader(x, localeMoment, format)}
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
