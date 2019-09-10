import React, { useContext } from 'react';
import { SchedulerContext } from './SchedulerContext';
import { DATETIME_FORMAT } from './constants';

export const RenderedEventView: React.FC<{}> = () => {
  const contextValue = useContext(SchedulerContext);

  if (contextValue.source) {
    const { source } = contextValue;
    return (
      <table className="rss_event_table">
        <tbody>
          {source.yAxis
            .filter(y => y.render)
            .map(y => {
              return (
                <tr key={y.id} style={{ height: y.height }}>
                  <td>
                    <div
                      style={{
                        position: 'relative',
                        height: y.height,
                        width: source.dimensions.dataLength - 1,
                      }}
                    >
                      {y.relatedIds.map(resourceId => {
                        const evt = source.renderedEvents.find(
                          re => re.id.toString() === resourceId.toString(),
                        );

                        if (evt) {
                          return (
                            <div
                              key={`${y.id}_${evt.id}`}
                              draggable
                              style={{
                                position: 'absolute',
                                width: evt.length,
                                height: evt.height,
                                top: evt.top,
                                left: evt.startPosition,
                                backgroundColor: evt.bgColor || 'red',
                                fontSize: 14,
                                border: '1px solid #999999',
                                borderRadius: 3,
                              }}
                            >
                              {evt.resourceId}
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  } else {
    return null;
  }
};
