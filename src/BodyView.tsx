import React from 'react';
import * as PropTypes from 'prop-types';
import { useSchedulerContext } from './SchedulerContext';

export interface BodyViewProps {
  cellWidth: number;
}

const BodyView: React.FC<BodyViewProps> = ({ cellWidth }) => {
  const contextValue = useSchedulerContext();

  if (contextValue.source && contextValue.styles) {
    const { slots, headers } = contextValue.source;
    const renderedSlots = slots.filter(s => s.render);
    const tableRows = renderedSlots.map(slot => {
      const rowCells = headers.map((header, index) => {
        const key = slot.id + '_' + header.time;
        const style = index === headers.length - 1 ? {} : { width: cellWidth };
        return (
          <td key={key} style={style}>
            <div></div>
          </td>
        );
      });

      return (
        <tr key={slot.id} style={{ height: slot.rowHeight }}>
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
  cellWidth: PropTypes.number.isRequired,
};

export default BodyView;
