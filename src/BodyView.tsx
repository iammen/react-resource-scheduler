import React from 'react';
import * as PropTypes from 'prop-types';
import { useSchedulerContext } from './SchedulerContext';

export interface BodyViewProps {
  width: number;
}

const BodyView: React.FC<BodyViewProps> = ({ width }) => {
  const contextValue = useSchedulerContext();

  if (contextValue.source) {
    const { xAxis } = contextValue.source;

    return (
      <tbody>
        {contextValue.source.yAxis
          .filter(y => y.render)
          .map(y => {
            return (
              <tr key={y.id} style={{ height: y.height }}>
                {xAxis.map((x, index) => {
                  return (
                    <td
                      key={`${y.id}_${index}`}
                      className={x.workingTime ? 'bg-normal' : 'bg-highlight'}
                      style={{ width: x.length }}
                    >
                      <div></div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
      </tbody>
    );
  } else {
    return null;
  }
};

BodyView.propTypes = {
  width: PropTypes.number.isRequired,
};

export default BodyView;
