import React from 'react';
import * as PropTypes from 'prop-types';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import 'antd/lib/grid/style/index.css';
import { useSchedulerContext } from './SchedulerContext';
import { DATETIME_FORMAT } from './config';

export interface EventPopoverProps {
  text: string;
  startTime: string;
  endTime: string;
  statusColor: string;
}

const EventPopover: React.FC<EventPopoverProps> = ({ endTime, startTime, statusColor, text }) => {
  const contextValue = useSchedulerContext();

  if (contextValue.styles && contextValue.source) {
    const { localeMoment } = contextValue.source;
    const start = localeMoment(startTime);
    const end = localeMoment(endTime);
    const subtitleRow = <div />;

    const opsRow = <div />;
    /*if (viewEventText !== undefined && viewEventClick !== undefined && (eventItem.clickable1 == undefined || eventItem.clickable1)) {
                  let col = (
                    <Col span={22}>
                      <span className="header2-text" style={{ color: '#108EE9', cursor: 'pointer' }} onClick={() => { viewEventClick(schedulerData, eventItem); }}>{viewEventText}</span>
                    </Col>
                  );
                  if (viewEvent2Text !== undefined && viewEvent2Click !== undefined && (eventItem.clickable2 == undefined || eventItem.clickable2)) {
                    col = (
                      <Col span={22}>
                        <span className="header2-text" style={{ color: '#108EE9', cursor: 'pointer' }} onClick={() => { viewEventClick(schedulerData, eventItem); }}>{viewEventText}</span><span className="header2-text" style={{ color: '#108EE9', cursor: 'pointer', marginLeft: '16px' }} onClick={() => { viewEvent2Click(schedulerData, eventItem); }}>{viewEvent2Text}</span>
                      </Col>
                    )
                  };
                  opsRow = (
                    <Row type="flex" align="middle">
                      <Col span={2}>
                        <div />
                      </Col>
                      {col}
                    </Row>
                  );
                }
                else if (viewEvent2Text !== undefined && viewEvent2Click !== undefined && (eventItem.clickable2 == undefined || eventItem.clickable2)) {
                  const col = (
                    <Col span={22}>
                      <span className="header2-text" style={{ color: '#108EE9', cursor: 'pointer' }} onClick={() => { viewEvent2Click(schedulerData, eventItem); }}>{viewEvent2Text}</span>
                    </Col>
                  );
                  opsRow = (
                    <Row type="flex" align="middle">
                      <Col span={2}>
                        <div />
                      </Col>
                      {col}
                    </Row>
                  );
                }*/

    const dateFormat = DATETIME_FORMAT;
    return (
      <div style={{ width: '300px' }}>
        <Row type="flex" align="middle">
          <Col span={2}>
            <div className="status-dot" style={{ backgroundColor: statusColor }} />
          </Col>
          <Col span={22} className="overflow-text">
            <span className="header2-text" title={text}>
              {text}
            </span>
          </Col>
        </Row>
        {subtitleRow}
        <Row type="flex" align="middle">
          <Col span={2}>
            <div />
          </Col>
          <Col span={22}>
            <span className="header1-text">{start.format('HH:mm')}</span>
            <span className="help-text" style={{ marginLeft: '8px' }}>
              {start.format(dateFormat)}
            </span>
            <span className="header2-text" style={{ marginLeft: '8px' }}>
              -
            </span>
            <span className="header1-text" style={{ marginLeft: '8px' }}>
              {end.format('HH:mm')}
            </span>
            <span className="help-text" style={{ marginLeft: '8px' }}>
              {end.format(dateFormat)}
            </span>
          </Col>
        </Row>
        {opsRow}
      </div>
    );
  } else {
    return null;
  }
};

EventPopover.propTypes = {
  text: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  statusColor: PropTypes.string.isRequired,
};

export default EventPopover;
