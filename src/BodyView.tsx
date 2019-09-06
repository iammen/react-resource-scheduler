import React from 'react';
import * as PropTypes from 'prop-types';
import { useSchedulerContext } from './SchedulerContext';

export interface BodyViewProps {
  width: number;
}

const BodyView: React.FC<BodyViewProps> = ({ width }) => {
  const contextValue = useSchedulerContext();

  if (contextValue.source) {
    const { headers } = contextValue.source;

    return (
      <tbody>
        {contextValue.source.slots
          .filter(s => s.render)
          .map(slot => {
            return (
              <tr key={slot.id} style={{ height: slot.height }}>
                {headers.map((header, index) => {
                  return (
                    <td
                      key={`${slot.id}_${header.time}`}
                      className={header.workingTime ? 'bg-normal' : 'bg-highlight'}
                      style={index === headers.length - 1 ? {} : { width }}
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
