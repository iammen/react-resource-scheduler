import React, { useContext } from 'react';
import { Styles } from './Scheduler';
import { SchedulerDataManger } from './SchedulerDataManager';

export interface SchedulerDataContext {
  source: SchedulerDataManger;
  styles: Styles;
}

export const SchedulerContext = React.createContext<Partial<SchedulerDataContext>>({});

export const useSchedulerContext = () => useContext(SchedulerContext);
