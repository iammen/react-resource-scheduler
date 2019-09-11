import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSchedulerContext } from './SchedulerContext';
import { XAxis, YAxis } from './interface';
import RenderedEventView from './RenderedEventView';
import { TimePeriods } from './enum';

export interface DataViewProps {
  headerFormat: string;
  width: number;
}

const DataView: React.FC<DataViewProps> = ({ headerFormat, width }) => {
  const contextValue = useSchedulerContext();

  const renderHeader = (x: XAxis, locale: typeof moment, format?: string) => {
    return format
      ? format
          .split('\n')
          .map(f => locale(x.startTime).format(f))
          .map((text, i) => <div key={i}>{text}</div>)
      : [];
  };

  const renderBody = (xAxis: XAxis[], y: YAxis) => {
    return (
      <tr key={y.id} style={{ height: y.height }}>
        {xAxis.map((x, index) => {
          return (
            <td
              key={`${y.id}_${index}`}
              className={x.workingTime ? 'bg-normal' : 'bg-highlight'}
              style={x.length > 0 ? { width: x.length } : {}}
            >
              <></>
            </td>
          );
        })}
      </tr>
    );
  };

  if (contextValue.source) {
    const { dimensions, localeMoment, xAxis, timePeriod } = contextValue.source;
    const overflowX: React.CSSProperties =
      timePeriod === TimePeriods.Quarter || timePeriod === TimePeriods.Year
        ? { overflowX: 'scroll' }
        : {};
    const innerWidth: React.CSSProperties =
      timePeriod === TimePeriods.Quarter || timePeriod === TimePeriods.Year
        ? { width: dimensions.dataSlotWidth * xAxis.length }
        : { width: '100%' };

    return (
      <div className="rss_data_scroll" style={{ ...overflowX, width }}>
        <div className="rss_data_container" style={innerWidth}>
          <table className="rss_data_table" cellSpacing={0} cellPadding={0}>
            <thead>
              <tr style={{ height: 40 }}>
                {xAxis.map((x, index) => {
                  return (
                    <th
                      key={`header_${index}`}
                      className={`header-text ${x.workingTime ? 'bg-normal' : 'bg-highlight'}`}
                      style={x.length > 0 ? { width: x.length } : {}}
                    >
                      {renderHeader(x, localeMoment, headerFormat)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {contextValue.source.yAxis.filter(y => y.render).map(y => renderBody(xAxis, y))}
            </tbody>
          </table>
          <div style={{ position: 'absolute', top: 40 }}>
            <RenderedEventView />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

DataView.propTypes = {
  headerFormat: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
};

export default DataView;
