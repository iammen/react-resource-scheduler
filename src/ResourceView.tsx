import React from 'react';
import * as PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import { useSchedulerContext } from './SchedulerContext';
import { YAxis } from './interface';

export interface ResourceViewProps {
  text?: string;
  width: number;
}

const ResourceView: React.FC<ResourceViewProps> = ({ text, width }) => {
  const contextValue = useSchedulerContext();

  if (contextValue.source) {
    const { dimensions } = contextValue.source;
    return (
      <div className="rss_resource_container" style={{ width }}>
        <table className="rss_resource_table" cellSpacing={0} cellPadding={0}>
          <thead>
            <tr style={{ height: 40 }}>
              <th className="header3-text" style={{ width }}>
                {text || 'Resources'}
              </th>
            </tr>
          </thead>
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
                      <Icon type="minus-square" key={`es${y.indent}`} style={{}} className="" />
                    ) : (
                      <Icon type="plus-square" key={`es${y.indent}`} style={{}} className="" />
                    ),
                  );
                } else {
                  indents.push(<span key={`es${y.indent}`} className="expander-space"></span>);
                }

                return (
                  <tr key={y.id} style={{ height: y.height }}>
                    <td data-resource-id={y.id} style={{ width }}>
                      <div
                        title={y.text}
                        className="overflow-text header2-text"
                        style={{ textAlign: 'left' }}
                      >
                        <span className="slot-cell">
                          {indents}
                          <span className="slot-text">{y.text}</span>
                        </span>
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
  text: PropTypes.string,
  width: PropTypes.number.isRequired,
};

export default ResourceView;
