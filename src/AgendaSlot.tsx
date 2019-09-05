import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import AgendaCell from './AgendaCell';
import { DATE_FORMAT } from './config';
import { Slot } from './interface';
import { useSchedulerContext } from './SchedulerContext';

export interface AgendaSlotProps {
  defaultValue: Slot;
  itemClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export default class AgendaSlot extends Component<AgendaSlotProps, {}> {
  static propTypes = {
    defaultValue: PropTypes.object.isRequired,
  };

  render() {
    const contextValue = useSchedulerContext();
    const { defaultValue } = this.props;

    if (contextValue.styles && contextValue.source) {
      // const width = value.styles.slotHeaderWidth || 17 - 2;
      const { startDate, endDate, localeMoment } = contextValue.source;
      const cells = defaultValue.cells.map(cell => {
        const start = localeMoment(startDate).format(DATE_FORMAT);
        const end = localeMoment(endDate)
          .add(1, 'days')
          .format(DATE_FORMAT);
        const headerStart = localeMoment(cell.start).format(DATE_FORMAT);
        const headerEnd = localeMoment(cell.end).format(DATE_FORMAT);

        if (start === headerStart && end === headerEnd) {
          cell.renderedEvents.forEach(event => {
            const durationStart = localeMoment(startDate);
            const durationEnd = localeMoment(endDate).add(1, 'days');
            const eventStart = localeMoment(event.start);
            const eventEnd = localeMoment(event.end);
            const isStart = eventStart >= durationStart;
            const isEnd = eventEnd < durationEnd;

            return (
              <AgendaCell key={event.id} defaultValue={event} isStart={isStart} isEnd={isEnd} />
            );
          });
        }
      });

      return (
        <tr style={{ minHeight: contextValue.styles.headerHeight || 17 + 2 }}>
          <td data-resource-id={defaultValue.id}>
            <span>{defaultValue.text}</span>
          </td>
          <td>
            <div className="day-event-container">{cells}</div>
          </td>
        </tr>
      );
    } else {
      return null;
    }
  }
}
