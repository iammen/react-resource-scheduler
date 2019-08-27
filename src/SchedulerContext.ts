import React from 'react';
import { SchedulerData } from './ScdulerData';
import { Styles } from './components/Scheduler';

export interface SchedulerDataContext {
  source: SchedulerData;
  styles: Styles;
}

export const SchedulerContext = React.createContext<Partial<SchedulerDataContext>>({});
