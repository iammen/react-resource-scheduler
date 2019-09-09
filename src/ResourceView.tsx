import React from 'react';
import * as PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import { useSchedulerContext } from './SchedulerContext';
import { YAxis } from './interface';

export interface ResourceViewProps {
  scrollbarHeight: number;
  onSlotClick?: (yaxis: YAxis) => void;
  toggleSlot?: (slotId: number) => void;
}

const ResourceView: React.FC<ResourceViewProps> = ({
  scrollbarHeight,
  onSlotClick,
  toggleSlot,
}) => {
  const contextValue = useSchedulerContext();

  if (contextValue.source) {
    return (
      <div style={{ paddingBottom: scrollbarHeight }}>
        <table className="rss_resource_table">
          <tbody>
            {contextValue.source.yAxis
              .filter(y => y.render)
              .map(y => {
                const indents = [];
                for (let i = 0; i < y.indent; i++) {
                  indents.push(<span key={`es${i}`} className="expander-space"></span>);
                }

                if (y.hasChildren) {
                  indents.push(
                    y.expanded ? (
                      <Icon
                        type="minus-square"
                        key={`es${y.indent}`}
                        style={{}}
                        className=""
                        onClick={() => {
                          if (toggleSlot) {
                            toggleSlot(y.id);
                          }
                        }}
                      />
                    ) : (
                      <Icon
                        type="plus-square"
                        key={`es${y.indent}`}
                        style={{}}
                        className=""
                        onClick={() => {
                          if (toggleSlot) {
                            toggleSlot(y.id);
                          }
                        }}
                      />
                    ),
                  );
                } else {
                  indents.push(<span key={`es${y.indent}`} className="expander-space"></span>);
                }

                const slotText = onSlotClick ? (
                  <span className="slot-cell">
                    {indents}
                    <a
                      className="slot-text"
                      onClick={() => {
                        onSlotClick(y);
                      }}
                    >
                      {y.text}
                    </a>
                  </span>
                ) : (
                  <span className="slot-cell">
                    {indents}
                    <span className="slot-text">{y.text}</span>
                  </span>
                );

                return (
                  <tr key={y.id} style={{ height: y.height }}>
                    <td data-resource-id={y.id}>
                      <div
                        title={y.text}
                        className="overflow-text header2-text"
                        style={{ textAlign: 'left' }}
                      >
                        {slotText}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return null;
  }
};

ResourceView.propTypes = {
  scrollbarHeight: PropTypes.number.isRequired,
  onSlotClick: PropTypes.func,
  toggleSlot: PropTypes.func,
};

export default ResourceView;
