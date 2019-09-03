import React from 'react';
import * as PropTypes from 'prop-types';
import AgendaSlot from './AgendaSlot';
import { useSchedulerContext } from './SchedulerContext';

export interface AgendaViewProps {
  agendaTitle?: string;
  resourceTitle?: string;
  itemClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const AgendaView: React.FC<AgendaViewProps> = props => {
  const contextValue = useSchedulerContext();

  if (contextValue.styles && contextValue.source) {
    return (
      <tr>
        <td>
          <table className="scheduler-table">
            <thead>
              <tr style={{ height: contextValue.styles.headerHeight }}>
                <th style={{ width: contextValue.styles.slotHeaderWidth }} className="header3-text">
                  {props.resourceTitle}
                </th>
                <th className="header3-text">{props.agendaTitle}</th>
              </tr>
            </thead>
            <tbody>
              {contextValue.source.slots.map(slot => (
                <AgendaSlot defaultValue={slot} key={slot.id} />
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    );
  } else {
    return null;
  }
};

AgendaView.propTypes = {
  agendaTitle: PropTypes.string,
  resourceTitle: PropTypes.string,
  itemClick: PropTypes.func,
};

AgendaView.defaultProps = {
  agendaTitle: 'Agenda',
  resourceTitle: 'Resource Name',
};

export default AgendaView;
