export type ID = number | string;

export interface Cell {
  workingTime: boolean;
  time: string;
  startTime: string;
  endTime: string;
  eventCount: number;
  addMore: number;
  addMoreIndex: number;
  renderedEvents: RenderedEvent[];
  text?: string;
}

export interface CellConfig {
  cellWidth: number | string;
  maxEvents: number;
  resourceWidth: number | string;
}

export interface CustomSchedulerDate {
  startDate: string;
  endDate: string;
  cellUnit?: number;
}

export interface Event {
  id: ID;
  bgColor?: string;
  end: string;
  groupId: number;
  groupName: string;
  length: number;
  recurringEventEnd?: string;
  recurringEventId?: number | string;
  recurringEventStart?: string;
  resourceId: ID;
  rrule?: string;
  start: string;
  startPosition: number;
  text: string;
}

export interface EventGroup {
  id: string;
  text: string;
  event: Event;
}

export interface RenderedEvent {
  id: ID;
  bgColor?: string;
  endTime: Date;
  groupId: number;
  groupName: string;
  height: number;
  length: number;
  recurringEventEnd?: string;
  recurringEventId?: number | string;
  recurringEventStart?: string;
  resourceId: ID;
  rrule?: string;
  startTime: Date;
  startPosition: number;
  text: string;
  yAxisIndex: number;
}

export interface Resource {
  id: number | string;
  text: string;
}

export interface SchedulerDataConfig {
  agendaMaxEventWidth: number;
  calendarPopoverEnabled: boolean;
  checkConflict: boolean;
  creatable: boolean;
  crossResourceMove: boolean;
  dayStartFrom: number;
  dayStopTo: number;
  defaultExpanded: boolean;
  defaultDataUnitLength: number;
  endResizable: boolean;
  eventItemHeight: number;
  eventItemLineHeight: number;
  eventItemPopoverEnabled: boolean;
  maxEvents: number;
  minuteStep: number;
  movable: boolean;
  nonAgendaSlotMinHeight: number;
  recurringEventsEnabled: boolean;
  relativeMove: boolean;
  resourceName: string;
  scrollToSpecialMomentEnabled: boolean;
  showNavigator: boolean;
  summaryPosition: number;
  taskName: string;
}

export interface SchedulerDimension {
  containerLength: number;
  resourceLength: number;
  dataLength: number;
  dataUnitLength: number;
  minimumDataUnitLength: number;
}

export interface Slot {
  id: number;
  cells: Cell[];
  expanded: boolean;
  groupOnly?: boolean;
  hasChildren: boolean;
  hasSummary: boolean;
  indent: number;
  eventsInRow: number;
  parentId?: number;
  render: boolean;
  height: number;
  text: string;
}

export interface View {
  text?: string;
  mode: string;
  showAgenda: boolean;
  isEventPerspective: boolean;
}

export interface XAxis {
  endTime: Date;
  startTime: Date;
  length: number;
  workingTime: boolean;
}

export interface XAxisHeader {
  time: string;
  workingTime: boolean;
}

export interface YAxis {
  id: number;
  expanded: boolean;
  groupOnly?: boolean;
  hasChildren: boolean;
  hasSummary: boolean;
  indent: number;
  parentId?: number;
  relatedIds: ID[];
  render: boolean;
  height: number;
  text: string;
}
