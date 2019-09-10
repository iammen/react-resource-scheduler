import React, { useContext } from 'react';
import { SchedulerSource } from './interface';

export interface SchedulerDataContext {
  source: SchedulerSource;
}

export const SchedulerContext = React.createContext<Partial<SchedulerDataContext>>({});

export const useSchedulerContext = () => useContext(SchedulerContext);
