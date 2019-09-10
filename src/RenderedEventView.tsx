import React, { useContext } from 'react';
import { SchedulerContext } from './SchedulerContext';
import { DATETIME_FORMAT } from './constants';

export const RenderedEventView: React.FC<{}> = () => {
  const contextValue = useContext(SchedulerContext);

  if (contextValue.source) {
    const { source } = contextValue;
    return (
      <tbody>
        {source.yAxis
          .filter(y => y.render)
          .map(y => {
            return (
              <tr key={y.id} style={{ height: y.height }}>
                <td style={{ width: source.dimensions.dataLength }}>
                  {source.renderedEvents
                    .filter(e => {
                      const yIndex = source.yAxis.findIndex(
                        yy => yy.id.toString() === e.resourceId.toString(),
                      );
                      return e.yAxisIndex === yIndex;
                    })
                    .map(e => {
                      return (
                        <div
                          key={`${y.id}_${e.id}`}
                          style={{
                            position: 'relative',
                            width: e.length,
                            height: e.height,
                            top: e.top,
                            left: e.startPosition,
                            backgroundColor: e.bgColor || 'red',
                          }}
                        >
                          {`${e.text}, start: ${source
                            .localeMoment(e.startTime)
                            .format(DATETIME_FORMAT)}, end: ${source
                            .localeMoment(e.endTime)
                            .format(DATETIME_FORMAT)}`}
                        </div>
                      );
                    })}
                </td>
              </tr>
            );
          })}
      </tbody>
    );
  } else {
    return null;
  }
};
