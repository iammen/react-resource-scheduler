export interface Cell {
  workingTime: boolean;
  time: string;
  start: string;
  end: string;
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
  id: number | string;
  groupId: number;
  groupName: string;
  start: string;
  end: string;
  resourceId: string;
  text: string;
  bgColor?: string;
  render?: boolean;
  rrule?: string;
  recurringEventId?: number | string;
  recurringEventStart?: string;
  recurringEventEnd?: string;
  span?: number;
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
  customCellWidth?: number | string;
  customMaxEvents?: any;
  dayCellWidth: number;
  dayMaxEvents: number;
  dayResourceTableWidth: number;
  dayStartFrom: number;
  dayStopTo: number;
  defaultEventBgColor: string;
  defaultExpanded: boolean;
  displayWeekend: boolean;
  endResizable: boolean;
  eventItemHeight: number;
  eventItemLineHeight: number;
  eventItemPopoverEnabled: boolean;
  headerEnabled: boolean;
  minuteStep: number;
  monthCellWidth: number;
  monthMaxEvents: number;
  monthResourceTableWidth: number;
  movable: boolean;
  nonAgendaSlotMinHeight: number;
  nonWorkingTimeBodyBgColor: string;
  nonWorkingTimeHeadBgColor: string;
  nonWorkingTimeHeadColor: string;
  quarterCellWidth: number;
  quarterMaxEvents: number;
  quarterResourceTableWidth: number;
  recurringEventsEnabled: boolean;
  relativeMove: boolean;
  resourceName: string;
  schedulerMaxHeight: number;
  schedulerWidth: number | string;
  scrollToSpecialMomentEnabled: boolean;
  selectedAreaColor: string;
  startResizable: boolean;
  summaryColor: string;
  summaryPosition: number;
  taskName: string;
  views: View[];
  weekCellWidth: number | string;
  weekMaxEvents: number;
  weekResourceTableWidth: number | string;
  yearCellWidth: number;
  yearMaxEvents: number;
  yearResourceTableWidth: number;
}

export interface SchedulerHeader {
  workingTime: boolean;
  time: string;
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
  viewType: string;
  showAgenda: boolean;
  isEventPerspective: boolean;
}

export interface ViewRender {
  cellWidth: ViewType<number | string>;
  maxEvents: ViewType<number>;
  resourceWidth: ViewType<number | string>;
}

export interface ViewType<T> {
  day: T;
  week: T;
  month: T;
  quarter: T;
  year: T;
}
