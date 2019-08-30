export interface CellData {
  nonWorkingTime: boolean;
  time: string;
  start: string;
  end: string;
  count: number;
  addMore: number;
  addMoreIndex: number;
  events: Event[];
  text?: string;
}

export interface CellConfig {
  cellWidth: number | string;
  maxEvents: number;
  resourceTableWidth: number | string;
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
  title: string;
  bgColor?: string;
  render?: any;
  rrule?: string;
  recurringEventId?: number | string;
  recurringEventStart?: string;
  recurringEventEnd?: string;
  span?: any;
}

export interface EventGroup {
  id: string;
  name: string;
  event: Event;
}

export interface Resource {
  id: string;
  name: string;
}

export interface SchedulerDataConfig {
  agendaMaxEventWidth: number;
  agendaResourceTableWidth: number;
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
  tableHeaderHeight: number;
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
  nonWorkingTime: boolean;
  time: string;
}

export interface Slot {
  id: number;
  name: string;
  parentId?: number;
  groupOnly?: boolean;
  hasSummary: boolean;
  rowMaxCount: number;
  rowHeight: number;
  cells: CellData[];
  indent: number;
  hasChildren: boolean;
  expanded: boolean;
  render: boolean;
}

export interface View {
  viewName?: string;
  viewType: string;
  showAgenda: boolean;
  isEventPerspective: boolean;
}

export interface ViewRender {
  cellWidth: ViewType<number | string>;
  maxEvents: ViewType<number>;
  resourceTableWidth: ViewType<number | string>;
}

export interface ViewType<T> {
  day?: T;
  week?: T;
  month?: T;
  quarter?: T;
  year?: T;
  custom?: T;
}