import React from 'react';
import * as PropTypes from 'prop-types';
import { useSchedulerContext } from './SchedulerContext';
import moment from 'moment';
import { XAxis } from './interface';

export interface HeaderViewProps {
  format?: string;
  height: number;
  labelWidth: number;
  title?: string;
  width?: number | string;
}

const HeaderView: React.FC<HeaderViewProps> = ({ format, height, labelWidth, title, width }) => {
  const contextValue = useSchedulerContext();

  const renderHeader = (x: XAxis, locale: typeof moment, headerFormat?: string) => {
    return headerFormat
      ? headerFormat
          .split('\n')
          .map(f => locale(x.startTime).format(f))
          .map((txt, i) => <div key={i}>{txt}</div>)
      : [];
  };

  if (contextValue.source) {
    const { xAxis, localeMoment } = contextValue.source;

    return (
      <table className="rss_data_header_table" cellSpacing={0} cellPadding={0} style={{ width }}>
        <thead>
          <tr style={{ height }}>
            <th className="header3-text" style={{ width: labelWidth }}>
              {title}
            </th>
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

HeaderView.propTypes = {
  format: PropTypes.string,
  height: PropTypes.number.isRequired,
  title: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

HeaderView.defaultProps = {
  format: 'ddd M/D',
  title: '',
  width: '100%',
};

export default HeaderView;
