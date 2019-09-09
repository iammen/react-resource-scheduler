import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import AgendaCell from './AgendaCell';
import { DATE_FORMAT } from './constants';
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
        const headerStart = localeMoment(cell.startTime).format(DATE_FORMAT);
        const headerEnd = localeMoment(cell.endTime).format(DATE_FORMAT);

        if (start === headerStart && end === headerEnd) {
          cell.renderedEvents.forEach(renderedEvent => {
            const durationStart = localeMoment(startDate);
            const durationEnd = localeMoment(endDate).add(1, 'days');
            const eventStart = localeMoment(renderedEvent.startTime);
            const eventEnd = localeMoment(renderedEvent.endTime);
            const isStart = eventStart >= durationStart;
            const isEnd = eventEnd < durationEnd;

            return (
              <AgendaCell
                key={renderedEvent.id}
                defaultValue={renderedEvent}
                isStart={isStart}
                isEnd={isEnd}
              />
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
