import React from 'react';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import { DEFAULT_VIEW_TYPES } from './constants';
import 'antd/lib/radio/style/index.css';

export interface ViewSelectorProps {
  value?: any;
  onChange?: (e: RadioChangeEvent) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({ value, onChange }) => {
  return (
    <Radio.Group value={value} size="default" onChange={onChange}>
      {DEFAULT_VIEW_TYPES.map(item => {
        return (
          <Radio.Button
            key={`${item.viewType}${item.isEventPerspective ? 1 : 0}`}
            value={item.viewType}
          >
            <span style={{ margin: '0px 8px' }}>{item.text}</span>
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
};
