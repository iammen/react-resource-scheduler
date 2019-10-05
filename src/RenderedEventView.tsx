import React, { useContext } from 'react';
import { SchedulerContext } from './SchedulerContext';

const RenderedEventView: React.FC<{}> = () => {
  const contextValue = useContext(SchedulerContext);

  if (contextValue.source) {
    const { source } = contextValue;
    return (
      <table className="rss_event_table" cellSpacing={0} cellPadding={0}>
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
                        width: '100%',
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
                                backgroundColor: evt.bgColor || '#1E95F3',
                                fontSize: 14,
                                borderRadius: 2,
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

export default RenderedEventView;
