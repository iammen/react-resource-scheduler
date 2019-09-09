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
  id: number | string;
  groupId: number;
  groupName: string;
  start: string;
  end: string;
  resourceId: string;
  text: string;
  bgColor?: string;
  rrule?: string;
  recurringEventId?: number | string;
  recurringEventStart?: string;
  recurringEventEnd?: string;
}

export interface EventGroup {
  id: string;
  text: string;
  event: Event;
}

export interface RenderedEvent {
  event: Event;
  render: boolean;
  span: number;
}

export interface Resource {
  id: string;
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

export interface ViewType<T> {
  day: T;
  week: T;
  month: T;
  quarter: T;
  year: T;
}
