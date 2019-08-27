import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import AgendaSlot from './AgendaSlot';
import { SchedulerContext } from '../SchedulerContext';

export interface AgendaViewProps {
  agendaTitle?: string;
  resourceTitle?: string;
  itemClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export default class AgendaView extends Component<AgendaViewProps, {}> {
  static propTypes = {
    agendaTitle: PropTypes.string,
    resourceTitle: PropTypes.string,
    itemClick: PropTypes.func,
  };

  static defaultProps = {
    agendaTitle: 'Agenda',
    resourceTitle: 'Resource Name',
  };

  render() {
    return (
      <SchedulerContext.Consumer>
        {value => {
          if (value.styles && value.source) {
            return (
              <tr>
                <td>
                  <table className="scheduler-table">
                    <thead>
                      <tr style={{ height: value.styles.headerHeight }}>
                        <th
                          style={{ width: value.styles.slotHeaderWidth }}
                          className="header3-text"
                        >
                          {this.props.resourceTitle}
                        </th>
                        <th className="header3-text">{this.props.agendaTitle}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {value.source.slots.map(slot => (
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
        }}
      </SchedulerContext.Consumer>
    );
  }
}
