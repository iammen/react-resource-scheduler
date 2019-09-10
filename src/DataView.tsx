import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSchedulerContext } from './SchedulerContext';
import { XAxis, YAxis } from './interface';
import RenderedEventView from './RenderedEventView';

export interface DataViewProps {
  headerFormat: string;
  headerHeight: number;
  width: number;
}

const DataView: React.FC<DataViewProps> = ({ headerHeight, headerFormat, width }) => {
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
    const { dimensions, localeMoment, xAxis } = contextValue.source;
    const style: React.CSSProperties =
      dimensions.dataUnitLength * xAxis.length > width
        ? { paddingBottom: 10 }
        : { paddingBottom: 0 };

    return (
      <div className="rss_data_container" style={{ ...style, width }}>
        <table className="rss_data_table" cellSpacing={0} cellPadding={0}>
          <thead>
            <tr style={{ height: headerHeight }}>
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
        <div style={{ position: 'absolute', top: headerHeight }}>
          <RenderedEventView />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

DataView.propTypes = {
  headerFormat: PropTypes.string.isRequired,
  headerHeight: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default DataView;
