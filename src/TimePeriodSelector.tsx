import React from 'react';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import { VIEW_MODES } from './constants';
import 'antd/lib/radio/style/index.css';

export interface TimePeriodSelectorProps {
  value?: any;
  onChange?: (e: RadioChangeEvent) => void;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({ value, onChange }) => {
  return (
    <Radio.Group value={value} size="default" onChange={onChange}>
      {VIEW_MODES.map(item => {
        return (
          <Radio.Button key={`${item.mode}${item.isEventPerspective ? 1 : 0}`} value={item.mode}>
            <span style={{ margin: '0px 8px' }}>{item.text}</span>
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
};

export default TimePeriodSelector;
