import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { SchedulerContext } from '../SchedulerContext';

export interface BodyViewProps {
  cellWidth: number;
}

export default class BodyView extends Component<BodyViewProps, {}> {
  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
  };

  render() {
    return (
      <SchedulerContext.Consumer>
        {value => {
          if (value.source && value.styles) {
            const { slots, headers, config } = value.source;
            const { cellWidth } = this.props;
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
        }}
      </SchedulerContext.Consumer>
    );
  }
}
