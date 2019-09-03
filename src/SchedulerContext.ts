import React, { useContext } from 'react';
import { SchedulerData } from './ScdulerData';
import { Styles } from './Scheduler';

export interface SchedulerDataContext {
  source: SchedulerData;
  styles: Styles;
}

export const SchedulerContext = React.createContext<Partial<SchedulerDataContext>>({});

export const useSchedulerContext = () => useContext(SchedulerContext);
