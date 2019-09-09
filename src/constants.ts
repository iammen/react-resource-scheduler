import { TimePeriods, SummaryPositions } from './enum';
import { SchedulerDataConfig, View } from './interface';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const VIEW_MODES = [
  { text: 'Day', mode: TimePeriods.Day, showAgenda: false, isEventPerspective: false },
  { text: 'Week', mode: TimePeriods.Week, showAgenda: false, isEventPerspective: false },
  { text: 'Month', mode: TimePeriods.Month, showAgenda: false, isEventPerspective: false },
  {
    text: 'Quarter',
    mode: TimePeriods.Quarter,
    showAgenda: false,
    isEventPerspective: false,
  },
  { text: 'Year', mode: TimePeriods.Year, showAgenda: false, isEventPerspective: false },
] as View[];

export default {
  addMorePopoverHeaderFormat: 'MMM D, YYYY dddd',
  agendaMaxEventWidth: 100,
  agendaViewHeader: 'Agenda',
  calendarPopoverEnabled: true,
  checkConflict: false,
  creatable: true,
  crossResourceMove: true,
  dayStartFrom: 0,
  dayStopTo: 23,
  defaultExpanded: true,
  defaultDataUnitLength: 20,
  endResizable: true,
  eventItemHeight: 22,
  eventItemLineHeight: 24,
  eventItemPopoverDateFormat: 'MMM D',
  eventItemPopoverEnabled: true,
  maxEvents: 99,
  minuteStep: 30,
  movable: true,
  nonAgendaDayCellHeaderFormat: 'ha',
  nonAgendaOtherCellHeaderFormat: 'ddd M/D',
  nonAgendaSlotMinHeight: 0,
  recurringEventsEnabled: true,
  relativeMove: true,
  resourceName: 'Resource Name',
  scrollToSpecialMomentEnabled: true,
  showNavigator: true,
  summaryPosition: SummaryPositions.TopRight,
  taskName: 'Task Name',
} as SchedulerDataConfig;
