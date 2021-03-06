import { ViewTypes, SummaryPositions } from './enum';
import { SchedulerDataConfig, View } from './interface';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_VIEW_TYPES = [
  { text: 'Day', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false },
  { text: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false },
  { text: 'Month', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: false },
  {
    text: 'Quarter',
    viewType: ViewTypes.Quarter,
    showAgenda: false,
    isEventPerspective: false,
  },
  { text: 'Year', viewType: ViewTypes.Year, showAgenda: false, isEventPerspective: false },
] as View[];

export default {
  schedulerWidth: '100%',
  schedulerMaxHeight: 0,

  agendaMaxEventWidth: 100,

  dayResourceTableWidth: 160,
  weekResourceTableWidth: '16%',
  monthResourceTableWidth: 160,
  quarterResourceTableWidth: 160,
  yearResourceTableWidth: 160,
  customResourceTableWidth: 160,

  dayCellWidth: 30,
  weekCellWidth: '12%',
  monthCellWidth: 80,
  quarterCellWidth: 80,
  yearCellWidth: 80,
  customCellWidth: 80,

  dayMaxEvents: 99,
  weekMaxEvents: 99,
  monthMaxEvents: 99,
  quarterMaxEvents: 99,
  yearMaxEvents: 99,
  customMaxEvents: 99,

  eventItemHeight: 22,
  eventItemLineHeight: 24,
  nonAgendaSlotMinHeight: 0,
  dayStartFrom: 0,
  dayStopTo: 23,
  defaultEventBgColor: '#80C5F6',
  selectedAreaColor: '#7EC2F3',
  nonWorkingTimeHeadColor: '#999999',
  nonWorkingTimeHeadBgColor: '#fff0f6',
  nonWorkingTimeBodyBgColor: '#fff0f6',
  summaryColor: '#666',
  summaryPosition: SummaryPositions.TopRight,
  groupOnlySlotColor: '#F8F8F8',

  startResizable: true,
  endResizable: true,
  movable: true,
  creatable: true,
  crossResourceMove: true,
  checkConflict: false,
  scrollToSpecialMomentEnabled: true,
  eventItemPopoverEnabled: true,
  calendarPopoverEnabled: true,
  recurringEventsEnabled: true,
  headerEnabled: true,
  displayWeekend: true,
  relativeMove: true,
  defaultExpanded: true,

  resourceName: 'Resource Name',
  taskName: 'Task Name',
  agendaViewHeader: 'Agenda',
  addMorePopoverHeaderFormat: 'MMM D, YYYY dddd',
  eventItemPopoverDateFormat: 'MMM D',
  nonAgendaDayCellHeaderFormat: 'ha',
  nonAgendaOtherCellHeaderFormat: 'ddd M/D',

  minuteStep: 30,

  views: [
    { text: 'Day', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false },
    { text: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false },
    { text: 'Month', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: false },
    {
      text: 'Quarter',
      viewType: ViewTypes.Quarter,
      showAgenda: false,
      isEventPerspective: false,
    },
    { text: 'Year', viewType: ViewTypes.Year, showAgenda: false, isEventPerspective: false },
  ] as View[],
} as SchedulerDataConfig;
