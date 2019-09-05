import React from 'react';
import * as PropTypes from 'prop-types';
import { useSchedulerContext } from './SchedulerContext';

export interface BodyViewProps {
  width: number;
}

const BodyView: React.FC<BodyViewProps> = ({ width }) => {
  const contextValue = useSchedulerContext();

  if (contextValue.source && contextValue.styles) {
    const { slots, headers } = contextValue.source;
    const renderedSlots = slots.filter(s => s.render);
    const tableRows = renderedSlots.map(slot => {
      const rowCells = headers.map((header, index) => {
        const key = slot.id + '_' + header.time;
        const style = index === headers.length - 1 ? {} : { width };
        return (
          <td key={key} style={style}>
            <div></div>
          </td>
        );
      });

      return (
        <tr key={slot.id} style={{ height: slot.height }}>
          {rowCells}
        </tr>
      );
    });

    return <tbody>{tableRows}</tbody>;
  } else {
    return null;
  }
};

BodyView.propTypes = {
  width: PropTypes.number.isRequired,
};

export default BodyView;
