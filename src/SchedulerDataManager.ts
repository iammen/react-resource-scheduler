import moment from 'moment';
import { rrulestr } from 'rrule';
import config from './config';
import {
  Cell,
  CustomSchedulerDate,
  Event,
  EventGroup,
  Resource,
  SchedulerDataConfig,
  SchedulerHeader,
  Slot,
} from './interface';
import { ViewTypes, CellUnits } from './enum';
import { DATE_FORMAT, DATETIME_FORMAT } from './config';
import { isWorkingTime } from './_util/isWorkingTime';
import { getDateLabel } from './_util/getDateLabel';

interface InitProps {
  currentDate: string;
  events: Event[];
  isEventPerspective: boolean;
  language: string;
  minuteStep: number;
  newConfig?: any;
  resources: Resource[];
  showAgenda: boolean;
  viewType: string;
  customFunc?: CustomSchedulerFunc;
}

export interface CustomSchedulerFunc {
  getCustomSchedulerDate?: (
    data: SchedulerDataManger,
    num: number,
    date?: string,
  ) => CustomSchedulerDate;
  getSummary?: () => void;
}

export class SchedulerDataManger {
  public cellUnit: number;
  public config: SchedulerDataConfig;
  public customFunc?: CustomSchedulerFunc;
  public endDate?: string;
  public eventGroups: EventGroup[];
  public eventGroupsAutoGenerated: boolean;
  public events: Event[];
  public headers: SchedulerHeader[];
  public isEventPerspective: boolean;
  public language: string;
  public localeMoment: typeof moment;
  public resizing: boolean;
  public resources: any[];
  public scrollToSpecialMoment: boolean;
  public selectDate?: string;
  public showAgenda: boolean;
  public slots: Slot[];
  public startDate?: string;

  /**
   * viewType is the initial view type, now Scheduler supports Day, Week, Month, Quarter, Year
   * 5 built-in view types, in addition Scheduler now supports Custom, Custom1, Custom2 3
   * custom view types at the same time, in which you can control the time window yourself
   */
  public viewType: string;

  // Default value is 23.
  private endTimeOfDay: number;

  // Default value is 0.
  private startTimeOfDay: number;

  private minuteStep: number;

  // Minimum height per slot.
  private slotMinHeight: number;

  // Line height of an event.
  private eventHeight: number;

  constructor(args: Partial<InitProps>) {
    this.resources = args.resources || [];
    this.events = args.events || [];
    this.eventGroups = [];
    this.slots = [];
    this.eventGroupsAutoGenerated = true;
    this.headers = [];
    this.viewType = args.viewType || ViewTypes.Week;
    this.cellUnit =
      args.viewType && args.viewType === ViewTypes.Day ? CellUnits.Hour : CellUnits.Day;
    this.config = config;
    this.showAgenda = args.showAgenda || false;
    this.isEventPerspective = args.isEventPerspective || false;
    this.resizing = false;
    this.scrollToSpecialMoment = false;
    this.language = args.language || 'en';
    this.localeMoment = moment;

    this.startTimeOfDay = 0;
    this.endTimeOfDay = 23;
    this.minuteStep = args.minuteStep || 30;
    this.slotMinHeight = 24;
    this.eventHeight = 24;

    this.validateMinuteStep(this.minuteStep);
    this.customFunc = args.customFunc || undefined;
    this.resolveDateRange(0, args.currentDate || moment().format(DATE_FORMAT));
    this.createHeaders();
    this.createSlots();
  }

  public addEventGroup(eventGroup: EventGroup) {
    const existedEventGroups = this.eventGroups.filter(x => x.id === eventGroup.id);
    if (existedEventGroups.length === 0) {
      this.eventGroups.push(eventGroup);
      this.createSlots();
    }
  }

  public addResource(resource: Resource) {
    const existedResources = this.resources.filter(x => x.id === resource.id);
    if (existedResources.length === 0) {
      this.resources.push(resource);
      this.createSlots();
    }
  }

  public getDateLabel() {
    const start = this.localeMoment(this.startDate);
    const end = this.localeMoment(this.endDate);
    let dateLabel = start.format('LL');

    if (start !== end) {
      dateLabel = `${start.format('LL')}-${end.format('LL')}`;
    }

    dateLabel = getDateLabel(this, this.viewType, this.startDate || '', this.endDate || '');

    return dateLabel;
  }

  public getMinuteStepsInHour() {
    return 60 / this.minuteStep;
  }

  public getScrollToSpecialMoment() {
    if (this.config.scrollToSpecialMomentEnabled) {
      return this.scrollToSpecialMoment;
    }
    return false;
  }

  public setDate(date?: moment.Moment) {
    const val = date
      ? date.locale(this.language).format(DATE_FORMAT)
      : moment()
          .locale(this.language)
          .format(DATE_FORMAT);
    this.resolveDateRange(0, val);
    this.events = [];
    this.createHeaders();
    this.createSlots();
  }

  public setEventGroupsAutoGenerated(autoGenerated: boolean) {
    this.eventGroupsAutoGenerated = autoGenerated;
  }

  public setEvents(events: Event[]) {
    if (events.length > 0) {
      this.validateEvents(events);
      this.events = events;

      if (this.eventGroupsAutoGenerated) {
        this.generateEventGroups();
      }

      if (this.config.recurringEventsEnabled) {
        this.handleRecurringEvents();
      }

      this.createSlots();
    }
  }

  public setMinuteStep(minuteStep: number) {
    if (this.minuteStep !== minuteStep) {
      this.validateMinuteStep(minuteStep);
      this.minuteStep = minuteStep;
      this.createHeaders();
      this.createSlots();
    }
  }

  public setResources(resources: Resource[]) {
    if (resources.length > 0) {
      this.validateResource(resources);
      this.resources = resources;
      this.createSlots();
      this.setScrollToSpecialMoment(true);
    }
  }

  public setScrollToSpecialMoment(scrollToSpecialMoment: boolean) {
    if (this.config.scrollToSpecialMomentEnabled) {
      this.scrollToSpecialMoment = scrollToSpecialMoment;
    }
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /**
   * Attach an event into the event array at the specific position.
   * @param event An event object.
   */
  private attachEvent(event: Event) {
    let pos = 0;
    const eventStart = this.localeMoment(event.start);
    this.events.forEach((evt, index) => {
      const start = this.localeMoment(evt.start);
      if (eventStart >= start) {
        pos = index + 1;
      }
    });
    this.events.splice(pos, 0, event);
  }

  private createHeaders() {
    this.headers = [];
    let start = this.localeMoment(this.startDate);
    let end = this.localeMoment(this.endDate);
    let header = start;

    if (this.showAgenda) {
      this.headers.push({ time: header.format(DATETIME_FORMAT), workingTime: false });
    } else {
      if (this.cellUnit === CellUnits.Hour) {
        start = start.add(this.startTimeOfDay, 'hours');
        end = end.add(this.endTimeOfDay, 'hours');
        header = start;

        while (header >= start && header <= end) {
          const minuteSteps = this.getMinuteStepsInHour();
          for (let i = 0; i < minuteSteps; i++) {
            const hour = header.hour();
            if (hour >= this.startTimeOfDay && hour <= this.endTimeOfDay) {
              const time = header.format(DATETIME_FORMAT);
              const workingTime = isWorkingTime(time, this.localeMoment, this.cellUnit);
              this.headers.push({ time, workingTime });
            }

            header = header.add(this.minuteStep, 'minutes');
          }
        }
      } else {
        while (header >= start && header <= end) {
          const time = header.format(DATETIME_FORMAT);
          const dayOfWeek = header.weekday();
          if (this.config.displayWeekend || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
            const workingTime = isWorkingTime(time, this.localeMoment, this.cellUnit);
            this.headers.push({ time, workingTime });
          }

          header = header.add(1, 'days');
        }
      }
    }
  }

  private createSlots() {
    // Initialize slot data.
    this.slots = this.initializeSlot();

    // Loop through all events.
    this.events.forEach(event => {
      // Find the slot that matches an event.
      const slots = this.slots.filter(s => s.id.toString() === this.getEventResourceId(event));

      if (slots.length > 0) {
        // Get the first slot only.
        const slot = slots[0];
        const span = this.getSpan(event.start, event.end);
        const eventStart = this.localeMoment(event.start);
        const eventEnd = this.localeMoment(event.end);
        let orderIndx = -1;

        // Loop through all cells of matched slot.
        slot.cells.forEach((cell, index) => {
          const cellStart = this.localeMoment(cell.start);
          const cellEnd = this.localeMoment(cell.end);

          // If the event start and end in the cell range.
          if (cellEnd > eventStart && cellStart < eventEnd) {
            cell.eventCount += 1;

            // Re-calculate slot height.
            if (cell.eventCount > slot.eventsInRow) {
              slot.eventsInRow = cell.eventCount;
              const height =
                cell.eventCount * this.eventHeight +
                (this.config.creatable && !this.config.checkConflict ? 20 : 2);
              if (height > slot.height) {
                slot.height = height;
              }
            }

            // Define the order index for an event.
            if (orderIndx === -1) {
              orderIndx = cell.renderedEvents.length;
            }

            cell.renderedEvents[orderIndx] = { ...event, render: true, span };
          }
        });
      }
    });
  }

  private detachEvent(event: Event) {
    const index = this.events.indexOf(event);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  private generateEventGroups() {
    this.eventGroups = [];
    const set = new Set();
    this.events.forEach(event => {
      const id = this.getEventGroupId(event);
      const text = this.getEventGroupName(event);

      if (!set.has(id)) {
        this.eventGroups.push({
          id,
          text,
          event,
        });

        set.add(id);
      }
    });
  }

  private getCellMaxEvents() {
    return this.viewType === ViewTypes.Week
      ? this.config.weekMaxEvents
      : this.viewType === ViewTypes.Day
      ? this.config.dayMaxEvents
      : this.viewType === ViewTypes.Month
      ? this.config.monthMaxEvents
      : this.viewType === ViewTypes.Year
      ? this.config.yearMaxEvents
      : this.viewType === ViewTypes.Quarter
      ? this.config.quarterMaxEvents
      : this.config.customMaxEvents;
  }

  private getEventResourceId(event: Event) {
    return this.isEventPerspective ? this.getEventGroupId(event) : event.resourceId;
  }

  private getEventGroupId(event: Event) {
    return !!event.groupId ? event.groupId.toString() : event.id.toString();
  }

  private getEventGroupName(event: Event) {
    return !!event.groupName ? event.groupName : event.text;
  }

  private getSpan(startTime: string, endTime: string) {
    if (this.showAgenda) {
      return 1;
    }

    const start = this.localeMoment(startTime);
    const end = this.localeMoment(endTime);
    let span = 0;

    for (const header of this.headers) {
      const spanStart = this.localeMoment(header.time);
      const spanEnd =
        this.cellUnit === CellUnits.Hour
          ? this.localeMoment(header.time).add(this.minuteStep, 'minutes')
          : this.localeMoment(header.time).add(1, 'days');

      if (spanStart < end && spanEnd > start) {
        span++;
      }
    }

    return span;
  }

  private handleRecurringEvents() {
    const recurringEvents = this.events.filter(x => !!x.rrule);
    recurringEvents.forEach(event => {
      this.detachEvent(event);
    });

    recurringEvents.forEach(event => {
      const windowStart = this.localeMoment(this.startDate);
      const windowEnd = this.localeMoment(this.endDate).add(1, 'days');
      const eventStart = this.localeMoment(event.start);
      const eventEnd = this.localeMoment(event.end);
      let rule = rrulestr(event.rrule || '');
      const oldDtstart = !!rule.origOptions.dtstart
        ? this.localeMoment(rule.origOptions.dtstart)
        : undefined;

      if (!rule.origOptions.until || windowEnd < this.localeMoment(rule.origOptions.until)) {
        rule.origOptions.until = windowEnd.toDate();
      }

      // reload
      rule = rrulestr(rule.toString());
      /* if (event.exdates || event.exrule) {
        const rruleSet = new RRuleSet();
        rruleSet.rrule(rule);
        if (event.exrule) {
          rruleSet.exrule(rrulestr(event.exrule));
        }
        if (event.exdates) {
          event.exdates.forEach(exdate => {
            rruleSet.exdate(this.localeMoment(exdate).toDate());
          });
        }
        rule = rruleSet;
      } */

      const all = rule.all();
      const newEvents: Event[] = all.map((time, index) => {
        return {
          ...event,
          recurringEventId: event.id,
          recurringEventStart: event.start,
          recurringEventEnd: event.end,
          id: `${event.id}-${index}`,
          start: rule.origOptions.tzid
            ? this.localeMoment
                .utc(time)
                .utcOffset(this.localeMoment().utcOffset(), true)
                .format(DATETIME_FORMAT)
            : this.localeMoment(time).format(DATETIME_FORMAT),
          end: rule.origOptions.tzid
            ? this.localeMoment
                .utc(time)
                .utcOffset(this.localeMoment().utcOffset(), true)
                .add(eventEnd.diff(eventStart), 'ms')
                .format(DATETIME_FORMAT)
            : this.localeMoment(time)
                .add(eventEnd.diff(eventStart), 'ms')
                .format(DATETIME_FORMAT),
        };
      });

      newEvents.forEach(newEvent => {
        const newEventStart = this.localeMoment(newEvent.start);
        const newEventEnd = this.localeMoment(newEvent.end);

        if (
          newEventStart < windowEnd &&
          newEventEnd > windowStart &&
          (!oldDtstart || newEventStart >= oldDtstart)
        ) {
          this.attachEvent(newEvent);
        }
      });
    });
  }

  private initializeCell(header: SchedulerHeader) {
    const startDt = this.localeMoment(header.time);
    const start = startDt.format(DATETIME_FORMAT);
    const end = this.showAgenda
      ? this.viewType === ViewTypes.Week
        ? startDt.add(1, 'weeks').format(DATETIME_FORMAT)
        : this.viewType === ViewTypes.Day
        ? startDt.add(1, 'days').format(DATETIME_FORMAT)
        : this.viewType === ViewTypes.Month
        ? startDt.add(1, 'months').format(DATETIME_FORMAT)
        : this.viewType === ViewTypes.Year
        ? startDt.add(1, 'years').format(DATETIME_FORMAT)
        : this.viewType === ViewTypes.Quarter
        ? startDt.add(1, 'quarters').format(DATETIME_FORMAT)
        : this.localeMoment(this.endDate)
            .add(1, 'days')
            .format(DATETIME_FORMAT)
      : this.cellUnit === CellUnits.Hour
      ? startDt.add(this.minuteStep, 'minutes').format(DATETIME_FORMAT)
      : startDt.add(1, 'days').format(DATETIME_FORMAT);

    return {
      time: header.time,
      workingTime: header.workingTime,
      start,
      end,
      eventCount: 0,
      addMore: 0,
      addMoreIndex: 0,
      renderedEvents: [],
    } as Cell;
  }

  private initializeSlot() {
    const slots = this.isEventPerspective ? this.eventGroups : this.resources;
    const slotTree: any[] = [];
    const slotMap = new Map();

    // Loop through each resource.
    slots.forEach(slot => {
      const cells = this.headers.map(header => {
        return this.initializeCell(header);
      });

      const data: Slot = {
        id: slot.id,
        text: slot.text,
        parentId: slot.parentId,
        groupOnly: slot.groupOnly,
        hasSummary: false,
        eventsInRow: 0,
        height: this.slotMinHeight !== 0 ? this.slotMinHeight : this.eventHeight + 2,
        cells,
        indent: 0,
        hasChildren: false,
        expanded: true,
        render: true,
      };
      let value;

      if (slotMap.has(slot.id)) {
        value = slotMap.get(slot.id);
        value.data = data;
      } else {
        value = {
          data,
          children: [],
        };
        slotMap.set(slot.id, value);
      }

      const parentId = slot.parentId;
      if (!parentId || parentId === slot.id) {
        slotTree.push(value);
      } else {
        let parentValue;
        if (slotMap.has(parentId)) {
          parentValue = slotMap.get(parentId);
        } else {
          parentValue = {
            data: undefined,
            children: [],
          };
          slotMap.set(parentId, parentValue);
        }

        parentValue.children.push(value);
      }
    });

    const slotStack = [];
    let i;
    for (i = slotTree.length - 1; i >= 0; i--) {
      slotStack.push(slotTree[i]);
    }

    const initialData: Slot[] = [];
    let currentNode;
    while (slotStack.length > 0) {
      currentNode = slotStack.pop();
      if (currentNode.data.indent > 0) {
        currentNode.data.render = this.config.defaultExpanded;
      }
      if (currentNode.children.length > 0) {
        currentNode.data.hasChildren = true;
        currentNode.data.expanded = this.config.defaultExpanded;
      }
      initialData.push(currentNode.data);

      for (i = currentNode.children.length - 1; i >= 0; i--) {
        currentNode.children[i].data.indent = currentNode.data.indent + 1;
        slotStack.push(currentNode.children[i]);
      }
    }

    return initialData;
  }

  private resolveDateRange(num: number, date?: string) {
    if (date) {
      this.selectDate = this.localeMoment(date).format(DATE_FORMAT);
    }

    if (this.viewType === ViewTypes.Week) {
      this.startDate = date
        ? this.localeMoment(date)
            .startOf('week')
            .format(DATE_FORMAT)
        : this.localeMoment(this.startDate)
            .add(num, 'weeks')
            .format(DATE_FORMAT);
      this.endDate = this.localeMoment(this.startDate)
        .endOf('week')
        .format(DATE_FORMAT);
    } else if (this.viewType === ViewTypes.Day) {
      this.startDate = date
        ? this.selectDate
        : this.localeMoment(this.startDate)
            .add(num, 'days')
            .format(DATE_FORMAT);
      this.endDate = this.startDate;
    } else if (this.viewType === ViewTypes.Month) {
      this.startDate = date
        ? this.localeMoment(date)
            .startOf('month')
            .format(DATE_FORMAT)
        : this.localeMoment(this.startDate)
            .add(num, 'months')
            .format(DATE_FORMAT);
      this.endDate = this.localeMoment(this.startDate)
        .endOf('month')
        .format(DATE_FORMAT);
    } else if (this.viewType === ViewTypes.Quarter) {
      this.startDate = date
        ? this.localeMoment(date)
            .startOf('quarter')
            .format(DATE_FORMAT)
        : this.localeMoment(this.startDate)
            .add(num, 'quarters')
            .format(DATE_FORMAT);
      this.endDate = this.localeMoment(this.startDate)
        .endOf('quarter')
        .format(DATE_FORMAT);
    } else if (this.viewType === ViewTypes.Year) {
      this.startDate = date
        ? this.localeMoment(date)
            .startOf('year')
            .format(DATE_FORMAT)
        : this.localeMoment(this.startDate)
            .add(num, 'years')
            .format(DATE_FORMAT);
      this.endDate = this.localeMoment(this.startDate)
        .endOf('year')
        .format(DATE_FORMAT);
    }
  }

  private validateEvents(events: Event[]) {
    if (Object.prototype.toString.call(events) !== '[object Array]') {
      throw new Error('Events should be Array object');
    }

    events.forEach((evt, index) => {
      if (!evt) {
        console.error(`Event undefined: ${index}`);
        throw new Error(`Event undefined: ${index}`);
      }

      if (!evt.id || !evt.resourceId || !evt.text || !evt.start || !evt.end) {
        console.error('Event property missed', index, evt);
        throw new Error(`Event property undefined: ${index}`);
      }
    });
  }

  private validateMinuteStep(minuteStep: number) {
    if (60 % minuteStep !== 0) {
      console.error(
        'Minute step is not set properly - 60 minutes must be divisible without remainder by this number',
      );
      throw new Error(
        'Minute step is not set properly - 60 minutes must be divisible without remainder by this number',
      );
    }
  }

  private validateResource(resources: Resource[]) {
    if (Object.prototype.toString.call(resources) !== '[object Array]') {
      throw new Error('Resources should be Array object');
    }

    resources.forEach((r, index) => {
      if (!r) {
        console.error(`Resource undefined: ${index}`);
        throw new Error(`Resource undefined: ${index}`);
      }
      if (!r.id || !r.text) {
        console.error('Resource property missed', index, r);
        throw new Error(`Resource property undefined: ${index}`);
      }
    });
  }
}
