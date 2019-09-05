import React from 'react';
import * as PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import { useSchedulerContext } from './SchedulerContext';
import { Slot } from './interface';

export interface ResourceViewProps {
  contentScrollbarHeight: number;
  onSlotClick?: (slot: Slot) => void;
  toggleSlot?: (slotId: number) => void;
}

const ResourceView: React.FC<ResourceViewProps> = ({
  contentScrollbarHeight,
  onSlotClick,
  toggleSlot,
}) => {
  const contextValue = useSchedulerContext();

  if (contextValue.source && contextValue.styles) {
    const paddingBottom = contentScrollbarHeight;
    const renderedSlots = contextValue.source.slots.filter(o => o.render);
    const resources = renderedSlots.map(slot => {
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
            {slot.text}
          </a>
        </span>
      ) : (
        <span className="slot-cell">
          {indents}
          <span className="slot-text">{slot.text}</span>
        </span>
      );

      return (
        <tr key={slot.id} style={{ height: slot.height }}>
          <td data-resource-id={slot.id}>
            <div
              title={slot.text}
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
          <tbody>{resources}</tbody>
        </table>
      </div>
    );
  } else {
    return null;
  }
};

ResourceView.propTypes = {
  contentScrollbarHeight: PropTypes.number.isRequired,
  onSlotClick: PropTypes.func,
  toggleSlot: PropTypes.func,
};

export default ResourceView;
