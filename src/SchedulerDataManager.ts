import moment from 'moment';
import { rrulestr } from 'rrule';
import config from './constants';
import {
  Cell,
  CustomSchedulerDate,
  Event,
  EventGroup,
  Resource,
  SchedulerDataConfig,
  XAxisHeader,
  Slot,
  SchedulerDimension,
  XAxis,
  YAxis,
  RenderedEvent,
} from './interface';
import { TimePeriods, CellUnits, ViewTypes, YAxisDataTypes } from './enum';
import { DATE_FORMAT, DATETIME_FORMAT } from './constants';
import { isWorkingTime } from './_util/isWorkingTime';
import { ViewType, TimePeriod } from './Scheduler';

interface InitProps {
  currentDate: string;
  events: Event[];
  language: string;
  minuteStep: number;
  newConfig: any;
  resources: Resource[];
  timePeriod: TimePeriod;
  viewType: ViewType;
  yAxisType: YAxisDataType;
  customFunc: CustomSchedulerFunc;
}

export interface CustomSchedulerFunc {
  getCustomSchedulerDate?: (
    data: SchedulerDataManger,
    num: number,
    date?: string,
  ) => CustomSchedulerDate;
  getSummary?: () => void;
}

export type YAxisDataType = 'resource' | 'event';

export class SchedulerDataManger {
  public cellUnit: number;
  public config: SchedulerDataConfig;
  public customFunc?: CustomSchedulerFunc;

  // Scheduler's dimensions.
  public dimensions: SchedulerDimension;

  public eventGroups: EventGroup[];
  public eventGroupsAutoGenerated: boolean;
  public events: Event[];
  public headers: XAxisHeader[];
  public language: string;
  public localeMoment: typeof moment;
  public renderedEvents: RenderedEvent[];
  public resizing: boolean;
  public resources: any[];
  public scrollToSpecialMoment: boolean;
  public slots: Slot[];
  public yAxisDataType: YAxisDataType;

  // An array of X, Y Axis.
  public xAxis: XAxis[];
  public yAxis: YAxis[];

  /**
   * timePeriod is the initial view type, now Scheduler supports Day, Week, Month, Quarter, Year
   * 5 built-in view types, in addition Scheduler now supports Custom, Custom1, Custom2 3
   * custom view types at the same time, in which you can control the time window yourself
   */
  public timePeriod: TimePeriod;
  public viewType: ViewType;

  // Date range.
  public endDate: moment.Moment;
  public startDate: moment.Moment;

  // Default value is 23.
  private endTimeOfDay: number;

  // Default value is 0.
  private startTimeOfDay: number;

  private minuteStep: number;

  // Line height of an event.
  private eventHeight: number;

  // Minimum height per slot.
  private yAxisMaxHeight: number;

  constructor(args: Partial<InitProps>) {
    this.resources = args.resources || [];
    this.events = args.events || [];
    this.eventGroups = [];
    this.slots = [];
    this.eventGroupsAutoGenerated = true;
    this.headers = [];
    this.timePeriod = args.timePeriod || (TimePeriods.Week as TimePeriod);
    this.cellUnit =
      args.timePeriod && args.timePeriod === TimePeriods.Day ? CellUnits.Hour : CellUnits.Day;
    this.config = config;
    this.viewType = args.viewType || (ViewTypes.Timeline as ViewType);
    this.yAxisDataType = args.yAxisType || (YAxisDataTypes.Resource as YAxisDataType);
    this.renderedEvents = [];
    this.resizing = false;
    this.scrollToSpecialMoment = false;
    this.language = args.language || 'en';
    this.localeMoment = moment;

    this.startTimeOfDay = 0;
    this.endTimeOfDay = 23;
    this.minuteStep = args.minuteStep || 60;
    this.yAxisMaxHeight = 200;
    this.eventHeight = 24;

    this.dimensions = {
      containerLength: 0,
      resourceLength: 0,
      dataLength: 0,
      dataUnitLength: 0,
      minimumDataUnitLength: 0,
    };

    this.validateMinuteStep(this.minuteStep);
    this.customFunc = args.customFunc || undefined;
    this.resolveDateRange(args.currentDate);
    this.generateXAxis();
    this.generateYAxis();
    this.recalXAxisLength();
    this.recalYAxisLength();
    this.generateEvents();
  }

  public addEventGroup(eventGroup: EventGroup) {
    const existedEventGroups = this.eventGroups.filter(x => x.id === eventGroup.id);
    if (existedEventGroups.length === 0) {
      this.eventGroups.push(eventGroup);
      this.generateEvents();
    }
  }

  public addResource(resource: Resource) {
    const existedResources = this.resources.filter(x => x.id === resource.id);
    if (existedResources.length === 0) {
      this.resources.push(resource);
      this.generateEvents();
    }
  }

  public getDateTitle() {
    if (this.timePeriod === TimePeriods.Week) {
      if (this.startDate.year() !== this.endDate.year()) {
        return `${this.startDate.format('MMM D, YYYY')}-${this.endDate.format('MMM D, YYYY')}`;
      } else if (this.startDate.month() !== this.endDate.month()) {
        return `${this.startDate.format('MMM D')}-${this.endDate.format('MMM D, YYYY')}`;
      }

      return `${this.startDate.format('MMM D')}-${this.endDate.format('D, YYYY')}`;
    } else if (this.timePeriod === TimePeriods.Month) {
      return this.startDate.format('MMMM YYYY');
    } else if (this.timePeriod === TimePeriods.Quarter) {
      return `${this.startDate.format('MMM D')}-${this.endDate.format('MMM D, YYYY')}`;
    } else if (this.timePeriod === TimePeriods.Year) {
      return this.startDate.format('YYYY');
    }

    return this.startDate.format('MMM D, YYYY');
  }

  public getScrollToSpecialMoment() {
    if (this.config.scrollToSpecialMomentEnabled) {
      return this.scrollToSpecialMoment;
    }
    return false;
  }

  public recalDimensions(containerLength: number, resourceLength: number) {
    this.dimensions.containerLength = containerLength;
    this.dimensions.resourceLength = resourceLength;
    this.dimensions.dataLength = containerLength - resourceLength;
    this.recalXAxisLength();
  }

  public setDate(date?: moment.Moment) {
    const val = date
      ? date.locale(this.language).format(DATE_FORMAT)
      : moment()
          .locale(this.language)
          .format(DATE_FORMAT);
    this.resolveDateRange(val);
    this.events = [];
    this.generateXAxis();
    this.generateEvents();
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

      this.generateEvents();
    }
  }

  public setMinuteStep(minuteStep: number) {
    if (this.minuteStep !== minuteStep) {
      this.validateMinuteStep(minuteStep);
      this.minuteStep = minuteStep;
      this.generateXAxis();
      this.generateEvents();
    }
  }

  public setResources(resources: Resource[]) {
    if (resources.length > 0) {
      this.validateResource(resources);
      this.resources = resources;
      this.generateEvents();
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

  private calculateDataUnitLength() {
    if (
      this.timePeriod === TimePeriods.Day ||
      this.timePeriod === TimePeriods.Week ||
      this.timePeriod === TimePeriods.Month
    ) {
      this.dimensions.dataUnitLength = Math.ceil(this.dimensions.dataLength / this.xAxis.length);
      this.dimensions.minimumDataUnitLength =
        this.timePeriod === TimePeriods.Week
          ? Math.ceil(this.dimensions.dataLength / (7 * 24))
          : this.timePeriod === TimePeriods.Month
          ? Math.ceil(this.dimensions.dataUnitLength / (this.xAxis.length * 24))
          : Math.ceil(this.dimensions.dataLength / (24 * 60));
    } else {
      this.dimensions.dataUnitLength = this.config.defaultDataUnitLength;
      this.dimensions.minimumDataUnitLength = Math.ceil(
        this.dimensions.dataUnitLength / (this.xAxis.length * 24),
      );
    }
  }

  private detachEvent(event: Event) {
    const index = this.events.indexOf(event);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }

  private generateEvents() {
    // Sort event by date.
    this.events.sort((d1, d2) => {
      const dt1 = this.localeMoment(d1.start, DATETIME_FORMAT);
      const dt2 = this.localeMoment(d2.start, DATETIME_FORMAT);

      if (dt1.isAfter(dt2)) {
        return 1;
      } else if (dt1.isBefore(dt2)) {
        return -1;
      } else {
        return 1;
      }
    });

    // Loop through all events.
    this.events.forEach(e => {
      // Find the slot that matches an event.
      const yAxis = this.yAxis.filter(
        y => y.id.toString() === this.getEventResourceId(e).toString(),
      );

      if (yAxis.length > 0) {
        this.renderedEvents = yAxis.map((y, index) => {
          const event = this.generateEvent(e.start, e.end);
          return {
            ...event,
            id: e.id,
            bgColor: e.bgColor,
            height: this.eventHeight,
            resourceId: y.id,
            rrule: e.rrule,
            text: e.text,
            yAxisIndex: index,
          } as RenderedEvent;
        });
      }
    });

    console.log(this.renderedEvents);
  }

  private generateEvent(start: string, end: string): RenderedEvent {
    const startTime = this.localeMoment(start, DATETIME_FORMAT).toDate();
    const endTime = this.localeMoment(end, DATETIME_FORMAT).toDate();
    let startPosition = 0;
    let length = 0;
    const { xAxis } = this;

    for (let i = 0; i < xAxis.length; i++) {
      if (startPosition === 0 && startTime >= xAxis[i].startTime && startTime <= xAxis[i].endTime) {
        startPosition = i === 0 ? 0 : i * this.dimensions.dataUnitLength;
      } else if (endTime >= xAxis[i].startTime && endTime <= xAxis[i].endTime) {
        length = (i + 1) * this.dimensions.dataUnitLength;
        break;
      }
    }

    return {
      id: 0,
      endTime,
      groupId: 0,
      groupName: '',
      length,
      resourceId: 0,
      startTime,
      startPosition,
      text: '',
    } as RenderedEvent;
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

  private generateTimelineXAxis() {
    const start = this.localeMoment(this.startDate.toDate());
    const end = this.localeMoment(this.endDate.toDate());

    if (this.timePeriod === TimePeriods.Day) {
      start.add(this.startTimeOfDay, 'hours');
      end.add(this.endTimeOfDay, 'hours');
      const minuteSteps = 60 / this.minuteStep;

      while (start.isSameOrBefore(end)) {
        for (let i = 0; i < minuteSteps; i++) {
          const hour = start.hour();
          if (hour >= this.startTimeOfDay && hour <= this.endTimeOfDay) {
            const workingTime = isWorkingTime(start, this.cellUnit);
            const startTime = start.toDate();
            const endTime = start.add(minuteSteps, 'hours').toDate();
            this.xAxis.push({
              endTime,
              length: 0,
              startTime,
              workingTime,
            });
          }
        }
      }
    } else {
      while (start.isSameOrBefore(end)) {
        const workingTime = isWorkingTime(start, this.cellUnit);
        const startTime = start.toDate();
        const endTime = start.add(1, 'days').toDate();
        this.xAxis.push({
          endTime,
          length: 0,
          startTime,
          workingTime,
        });
      }
    }
  }

  /**
   * Generate X-Axis based on the view type.
   */
  private generateXAxis() {
    this.xAxis = [];

    if (this.viewType === ViewTypes.Agenda) {
      this.xAxis.push({
        endTime: this.startDate.toDate(),
        startTime: this.startDate.toDate(),
        length: 0,
        workingTime: false,
      });
    } else if (this.viewType === ViewTypes.Timeline) {
      this.generateTimelineXAxis();
    }
  }

  /**
   * Generate Y-Axis based on the resources.
   */
  private generateYAxis() {
    const rows = this.yAxisDataType === YAxisDataTypes.Resource ? this.resources : this.eventGroups;
    const rowTree: any[] = [];
    const rowMap = new Map();

    // Loop through each resource.
    rows.forEach(r => {
      const y: YAxis = {
        id: r.id,
        text: r.text,
        parentId: r.parentId,
        groupOnly: r.groupOnly || false,
        hasSummary: false,
        relatedIds: [],
        height: this.eventHeight,
        indent: 0,
        hasChildren: false,
        expanded: true,
        render: true,
      };
      let value;

      if (rowMap.has(r.id)) {
        value = rowMap.get(r.id);
        value.data = y;
      } else {
        value = {
          data: y,
          children: [],
        };
        rowMap.set(r.id, value);
      }

      const parentId = r.parentId;
      if (!parentId || parentId === r.id) {
        rowTree.push(value);
      } else {
        let parentValue;
        if (rowMap.has(parentId)) {
          parentValue = rowMap.get(parentId);
        } else {
          parentValue = {
            data: undefined,
            children: [],
          };
          rowMap.set(parentId, parentValue);
        }

        parentValue.children.push(value);
      }
    });

    const slotStack = [];
    let i;
    for (i = rowTree.length - 1; i >= 0; i--) {
      slotStack.push(rowTree[i]);
    }

    this.yAxis = [];
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
      this.yAxis.push(currentNode.data);

      for (i = currentNode.children.length - 1; i >= 0; i--) {
        currentNode.children[i].data.indent = currentNode.data.indent + 1;
        slotStack.push(currentNode.children[i]);
      }
    }
  }

  private getEventResourceId(event: Event) {
    return this.yAxisDataType === YAxisDataTypes.Resource
      ? event.resourceId
      : this.getEventGroupId(event);
  }

  private getEventGroupId(event: Event) {
    return !!event.groupId ? event.groupId.toString() : event.id.toString();
  }

  private getEventGroupName(event: Event) {
    return !!event.groupName ? event.groupName : event.text;
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

  private initializeCell(header: XAxisHeader) {
    const startDt = this.localeMoment(header.time);
    const startTime = startDt.format(DATETIME_FORMAT);
    const endTime =
      this.viewType === 'timeline'
        ? this.timePeriod === TimePeriods.Week
          ? startDt.add(1, 'weeks').format(DATETIME_FORMAT)
          : this.timePeriod === TimePeriods.Day
          ? startDt.add(1, 'days').format(DATETIME_FORMAT)
          : this.timePeriod === TimePeriods.Month
          ? startDt.add(1, 'months').format(DATETIME_FORMAT)
          : this.timePeriod === TimePeriods.Year
          ? startDt.add(1, 'years').format(DATETIME_FORMAT)
          : this.timePeriod === TimePeriods.Quarter
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
      startTime,
      endTime,
      eventCount: 0,
      addMore: 0,
      addMoreIndex: 0,
      renderedEvents: [],
    } as Cell;
  }

  private initializeSlot() {
    const slots = this.yAxisDataType === YAxisDataTypes.Event ? this.eventGroups : this.resources;
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
        height: this.eventHeight + 2,
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

  private recalXAxisLength() {
    if (
      this.dimensions.containerLength > 0 &&
      this.dimensions.resourceLength > 0 &&
      this.xAxis.length > 0
    ) {
      this.calculateDataUnitLength();

      // Re-assign all x-axis length.
      this.xAxis.forEach((x, indx) => {
        x.length = indx === this.xAxis.length - 1 ? 0 : this.dimensions.dataUnitLength;
      });
    }
  }

  private recalYAxisLength() {
    // Loop through all events.
    this.events.forEach(event => {
      // Find the y-axis that matches an event and then re-calculate the height.
      this.yAxis.forEach(y => {
        if (y.id.toString() === this.getEventResourceId(event)) {
          if (y.relatedIds.findIndex(r => r.toString() === event.id.toString()) === -1) {
            y.relatedIds.push(event.id);
          }

          y.height = y.relatedIds.length * this.eventHeight + 10;
        }

        if (y.height > this.yAxisMaxHeight) {
          y.height = this.yAxisMaxHeight;
        }
      });
    });
  }

  private resolveDateRange(date?: string) {
    if (this.timePeriod === TimePeriods.Day) {
      this.startDate = date
        ? this.localeMoment(date, DATE_FORMAT)
        : this.localeMoment(this.startDate).add(0, 'days');
      this.endDate = this.localeMoment(this.startDate, DATE_FORMAT);
    } else if (this.timePeriod === TimePeriods.Week) {
      this.startDate = date
        ? this.localeMoment(date).startOf('week')
        : this.localeMoment(this.startDate).add(0, 'weeks');
      this.endDate = this.localeMoment(this.startDate).endOf('week');
    } else if (this.timePeriod === TimePeriods.Month) {
      this.startDate = date
        ? this.localeMoment(date).startOf('month')
        : this.localeMoment(this.startDate).add(0, 'months');
      this.endDate = this.localeMoment(this.startDate).endOf('month');
    } else if (this.timePeriod === TimePeriods.Quarter) {
      this.startDate = date
        ? this.localeMoment(date).startOf('quarter')
        : this.localeMoment(this.startDate).add(0, 'quarters');
      this.endDate = this.localeMoment(this.startDate).endOf('quarter');
    } else if (this.timePeriod === TimePeriods.Year) {
      this.startDate = date
        ? this.localeMoment(date).startOf('year')
        : this.localeMoment(this.startDate).add(0, 'years');
      this.endDate = this.localeMoment(this.startDate).endOf('year');
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
