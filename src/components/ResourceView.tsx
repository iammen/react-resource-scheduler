import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import { SchedulerContext } from '../SchedulerContext';
import { Slot } from '../interface';

export interface ResourceViewProps {
  contentScrollbarHeight: number;
  onSlotClick?: (slot: Slot) => void;
  toggleSlot?: (slotId: number) => void;
}

export default class ResourceView extends Component<ResourceViewProps, {}> {
  static propTypes = {
    contentScrollbarHeight: PropTypes.number.isRequired,
    onSlotClick: PropTypes.func,
    toggleSlot: PropTypes.func,
  };

  render() {
    return (
      <SchedulerContext.Consumer>
        {value => {
          if (value.source && value.styles) {
            const { contentScrollbarHeight, onSlotClick, toggleSlot } = this.props;

            const paddingBottom = contentScrollbarHeight;
            const renderedSlots = value.source.slots.filter(o => o.render);
            const resourceList = renderedSlots.map(slot => {
              const indents = [];
              for (let i = 0; i < slot.indent; i++) {
                indents.push(<span key={`es${i}`} className="expander-space"></span>);
              }

              if (slot.hasChildren) {
                indents.push(
                  slot.expanded ? (
                    <Icon
                      type="minus-square"
                      key={`es${slot.indent}`}
                      style={{}}
                      className=""
                      onClick={() => {
                        if (toggleSlot) {
                          toggleSlot(slot.id);
                        }
                      }}
                    />
                  ) : (
                    <Icon
                      type="plus-square"
                      key={`es${slot.indent}`}
                      style={{}}
                      className=""
                      onClick={() => {
                        if (toggleSlot) {
                          toggleSlot(slot.id);
                        }
                      }}
                    />
                  ),
                );
              } else {
                indents.push(<span key={`es${slot.indent}`} className="expander-space"></span>);
              }

              const slotText = onSlotClick ? (
                <span className="slot-cell">
                  {indents}
                  <a
                    className="slot-text"
                    onClick={() => {
                      onSlotClick(slot);
                    }}
                  >
                    {slot.name}
                  </a>
                </span>
              ) : (
                <span className="slot-cell">
                  {indents}
                  <span className="slot-text">{slot.name}</span>
                </span>
              );

              return (
                <tr key={slot.id}>
                  <td data-resource-id={slot.id} style={{ height: slot.rowHeight }}>
                    <div
                      title={slot.name}
                      className="overflow-text header2-text"
                      style={{ textAlign: 'left' }}
                    >
                      {slotText}
                    </div>
                  </td>
                </tr>
              );
            });

            return (
              <div style={{ paddingBottom }}>
                <table className="resource-table">
                  <tbody>{resourceList}</tbody>
                </table>
              </div>
            );
          } else {
            return null;
          }
        }}
      </SchedulerContext.Consumer>
    );
  }
}
