import React, { Component, RefObject } from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Icon from 'antd/lib/icon';
import { RadioChangeEvent } from 'antd/lib/radio';
import Popover from 'antd/lib/popover';
import Calendar from 'antd/lib/calendar';
import DataView from './DataView';
import BodyView from './BodyView';
import HeaderView from './HeaderView';
import ResourceView from './ResourceView';
import AgendaView from './AgendaView';
import RenderedEventView from './RenderedEventView';
import TimePeriodSelector from './TimePeriodSelector';

import 'antd/lib/select/style/index.css';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/popover/style/index.css';
import 'antd/lib/calendar/style/index.css';
import './less/style.less';

import { SchedulerContext } from './SchedulerContext';
import { getScrollSpecialMoment } from './_util/getScrollSpecialMoment';
import { Event, Resource, SchedulerSource } from './interface';
import { TimePeriods, ViewTypes } from './enum';
import { SchedulerDataManger } from './SchedulerDataManager';
import { DATE_FORMAT } from './constants';

export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
export type ViewType = 'agenda' | 'timeline' | 'day' | 'week' | 'month' | 'map';

export interface SchedulerProps {
  agendaView?: React.ReactNode;
  cellWidth: number;
  currentDate: string;
  dateFormat: string;
  dndSources?: [];
  events: Event[];
  headerHeight: number;
  language: string;
  leftCustomHeader: React.ReactNode;
  locale: string;
  resourceWidth: number | string;
  resources: Resource[];
  rightCustomHeader: React.ReactNode;
  timeFormat: string;
  timePeriod: TimePeriod;
  viewType: ViewType;
  width: number | string;

  conflictOccurred?: () => void;
  eventItemTemplateResolver?: () => void;
  nonAgendaCellHeaderTemplateResolver?: () => void;
  slotClickedFunc?: () => void;
  slotItemTemplateResolver?: () => void;
  subtitleGetter?: () => void;
  toggleExpandFunc?: () => void;

  // Event handlers
  eventItemClick?: () => void;
  moveEvent?: () => void;
  movingEvent?: () => void;
  newEvent?: () => void;
  nextClick: (data: SchedulerDataManger) => void;
  onScrollBottom?: (
    data: SchedulerDataManger,
    ref: RefObject<HTMLDivElement>,
    hight: number,
  ) => void;
  onScrollLeft?: (data: SchedulerDataManger, ref: RefObject<HTMLDivElement>, width: number) => void;
  onScrollRight?: (
    data: SchedulerDataManger,
    ref: RefObject<HTMLDivElement>,
    width: number,
  ) => void;
  onScrollTop?: (data: SchedulerDataManger, ref: RefObject<HTMLDivElement>, hight: number) => void;
  onSelectDate: (data: SchedulerDataManger, date: moment.Moment) => void;
  onSetAddMoreState?: () => void;
  onTimePeriodChange?: (timePeriod: TimePeriod) => void;
  prevClick: (data: SchedulerDataManger) => void;
  updateEventEnd?: () => void;
  updateEventStart?: () => void;
  viewEvent2Click?: () => void;
  viewEventClick?: () => void;
}

interface SchedulerStates {
  resourceWidth: number;
  schedulerWidth: number;
  contentScrollbarHeight: number;
  contentScrollbarWidth: number;
  dndContext?: any;
  resourceScrollbarHeight: number;
  resourceScrollbarWidth: number;
  scrollLeft: number;
  scrollTop: number;
  visible: boolean;
}

export default class Scheduler extends Component<SchedulerProps, SchedulerStates> {
  static defaultProps: Partial<SchedulerProps> = {
    agendaView: undefined,
    cellWidth: 40,
    currentDate: moment().format(DATE_FORMAT),
    dateFormat: `ddd\nM/D`,
    headerHeight: 40,
    language: 'en',
    leftCustomHeader: undefined,
    locale: 'en',
    resourceWidth: 240,
    rightCustomHeader: undefined,
    timeFormat: 'ha',
    timePeriod: 'week',
    viewType: 'timeline',
    width: '100%',
  };

  static propTypes = {
    agendaView: PropTypes.node,
    cellWidth: PropTypes.number,
    dateFormat: PropTypes.string,
    dndSources: PropTypes.array,
    headerHeight: PropTypes.number,
    leftCustomHeader: PropTypes.node,
    rightCustomHeader: PropTypes.node,
    styles: PropTypes.object,
    timeFormat: PropTypes.string,
    timePeriod: PropTypes.string,
    viewType: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  currentArea: number;

  contentRef: RefObject<HTMLDivElement>;

  dataManger: SchedulerDataManger;

  headRef: RefObject<HTMLDivElement>;

  resourceRef: RefObject<HTMLDivElement>;

  selfRef: RefObject<HTMLDivElement>;

  source: SchedulerSource;

  constructor(props: SchedulerProps) {
    super(props);

    /* let sources = [];
    sources.push(
      new DnDSource(props => {
        return props.eventItem;
      }, EventItem),
    );
    if (dndSources != undefined && dndSources.length > 0) {
      sources = [...sources, ...dndSources];
    }
    const dndContext = new DnDContext(sources, ResourceEvents); */

    this.currentArea = -1;

    this.dataManger = new SchedulerDataManger({
      currentDate: props.currentDate,
      language: props.language,
      timePeriod: props.timePeriod,
      events: props.events,
      resources: props.resources,
    });
    this.source = this.dataManger.getSource();

    this.state = {
      resourceWidth: 0,
      schedulerWidth: 0,
      contentScrollbarHeight: 17,
      contentScrollbarWidth: 17,
      dndContext: undefined,
      resourceScrollbarHeight: 17,
      resourceScrollbarWidth: 17,
      scrollLeft: 0,
      scrollTop: 0,
      visible: false,
    };

    this.contentRef = React.createRef();
    this.headRef = React.createRef();
    this.resourceRef = React.createRef();
    this.selfRef = React.createRef();

    if (this.isResponsive()) {
      window.onresize = this.handleWindowResize;
    }
  }

  componentDidMount() {
    this.recalSchedulerWidth();
  }

  componentDidUpdate() {
    this.resolveScrollbarSize();

    /*if (this.dataManger.getScrollToSpecialMoment()) {
      if (
        this.contentRef &&
        this.contentRef.current &&
        this.contentRef.current.scrollWidth > this.contentRef.current.clientWidth
      ) {
        const start = this.dataManger.localeMoment(this.dataManger.startDate).startOf('day');
        const end = this.dataManger.localeMoment(this.dataManger.endDate).endOf('day');
        const specialMoment = getScrollSpecialMoment(this.dataManger, start, end);
        if (specialMoment >= start && specialMoment <= end) {
          let index = 0;
          this.dataManger.headers.forEach(item => {
            const header = this.dataManger.localeMoment(item.time);
            if (specialMoment >= header) {
              index++;
            }
          });
          this.contentRef.current.scrollLeft = (index - 1) * 10;

          this.dataManger.setScrollToSpecialMoment(false);
        }
      }
    }*/
  }

  goNext = () => {
    this.props.nextClick(this.dataManger);
  };

  goBack = () => {
    this.props.prevClick(this.dataManger);
  };

  handleContentMouseOut = () => {
    this.currentArea = -1;
  };

  handleContentMouseOver = () => {
    this.currentArea = 0;
  };

  handleContentScroll = () => {
    if (this.contentRef.current && this.headRef.current && this.resourceRef.current) {
      const { onScrollLeft, onScrollRight, onScrollTop, onScrollBottom } = this.props;
      const { scrollLeft, scrollTop } = this.state;

      if (this.currentArea === 0 || this.currentArea === -1) {
        if (this.headRef.current.scrollLeft !== this.contentRef.current.scrollLeft) {
          this.headRef.current.scrollLeft = this.contentRef.current.scrollLeft;
        }
        if (this.resourceRef.current.scrollTop !== this.contentRef.current.scrollTop) {
          this.resourceRef.current.scrollTop = this.contentRef.current.scrollTop;
        }
      }

      if (this.contentRef.current.scrollLeft !== scrollLeft) {
        if (this.contentRef.current.scrollLeft === 0 && onScrollLeft) {
          onScrollLeft(
            this.dataManger,
            this.contentRef,
            this.contentRef.current.scrollWidth - this.contentRef.current.clientWidth,
          );
        }
        if (
          this.contentRef.current.scrollLeft ===
            this.contentRef.current.scrollWidth - this.contentRef.current.clientWidth &&
          onScrollRight
        ) {
          onScrollRight(
            this.dataManger,
            this.contentRef,
            this.contentRef.current.scrollWidth - this.contentRef.current.clientWidth,
          );
        }
      } else if (this.contentRef.current.scrollTop !== scrollTop) {
        if (this.contentRef.current.scrollTop === 0 && onScrollTop) {
          onScrollTop(
            this.dataManger,
            this.contentRef,
            this.contentRef.current.scrollHeight - this.contentRef.current.clientHeight,
          );
        }
        if (
          this.contentRef.current.scrollTop ===
            this.contentRef.current.scrollHeight - this.contentRef.current.clientHeight &&
          onScrollBottom
        ) {
          onScrollBottom(
            this.dataManger,
            this.contentRef,
            this.contentRef.current.scrollHeight - this.contentRef.current.clientHeight,
          );
        }
      }
      this.setState({
        scrollLeft: this.contentRef.current.scrollLeft,
        scrollTop: this.contentRef.current.scrollTop,
      });
    }
  };

  handleHeadMouseOut = () => {
    this.currentArea = -1;
  };

  handleHeadMouseOver = () => {
    this.currentArea = 2;
  };

  handleHeadScroll = () => {
    if (
      (this.currentArea === 2 || this.currentArea === -1) &&
      (this.contentRef.current && this.headRef.current) &&
      this.contentRef.current.scrollLeft !== this.headRef.current.scrollLeft
    ) {
      this.contentRef.current.scrollLeft = this.headRef.current.scrollLeft;
    }
  };

  handleResourceMouseOut = () => {
    this.currentArea = -1;
  };

  handleResourceMouseOver = () => {
    this.currentArea = 1;
  };

  handleResourceScroll = () => {
    if (
      (this.currentArea === 1 || this.currentArea === -1) &&
      (this.contentRef.current && this.resourceRef.current) &&
      this.contentRef.current.scrollTop !== this.resourceRef.current.scrollTop
    ) {
      this.contentRef.current.scrollTop = this.resourceRef.current.scrollTop;
    }
  };

  handleDateSelect = (date?: moment.Moment) => {
    if (date) {
      this.setState({
        visible: false,
      });

      this.props.onSelectDate(this.dataManger, date);
    }
  };

  handleTimePeriodChange = (e: RadioChangeEvent) => {
    const timePeriod = e.target.value;
    this.dataManger.setTimePeriod(timePeriod);
    this.source = this.dataManger.getSource();

    if (this.props.onTimePeriodChange) {
      this.props.onTimePeriodChange(timePeriod);
    }
  };

  handleVisibleChange = (visible: boolean) => {
    this.setState({ visible });
  };

  handleWindowResize = () => {
    this.recalSchedulerWidth();
  };

  isResponsive() {
    return typeof this.props.width === 'string' && this.props.width.endsWith('%');
  }

  isResourceResponsive() {
    return this.props.resourceWidth.toString().endsWith('%');
  }

  recalSchedulerWidth() {
    if (this.selfRef.current && this.state.schedulerWidth !== this.selfRef.current.clientWidth) {
      const schedulerWidth = this.selfRef.current.clientWidth;
      const resourceWidth = this.resolveResourceWidth();
      this.dataManger.recalDimensions(schedulerWidth, resourceWidth);
      this.source = this.dataManger.getSource();

      this.setState({
        resourceWidth,
        schedulerWidth,
      });
    }
  }

  resolveResourceWidth() {
    if (this.selfRef.current) {
      return this.isResourceResponsive()
        ? (this.selfRef.current.offsetWidth *
            Number(this.props.resourceWidth.toString().slice(0, -1))) /
            100
        : Number(this.props.resourceWidth);
    } else {
      return 0;
    }
  }

  resolveSchedulerWidth = () => {
    if (this.selfRef.current) {
      return this.isResponsive()
        ? Number(
            this.selfRef.current.offsetWidth * Number(this.props.width.toString().slice(0, -1)),
          ) / 100
        : Number(this.props.width);
    } else {
      return 0;
    }
  };

  resolveScrollbarSize = () => {
    let contentScrollbarHeight = 17;
    let contentScrollbarWidth = 17;
    let resourceScrollbarHeight = 17;
    let resourceScrollbarWidth = 17;

    if (this.contentRef && this.contentRef.current) {
      contentScrollbarHeight =
        this.contentRef.current.offsetHeight - this.contentRef.current.clientHeight;
      contentScrollbarWidth =
        this.contentRef.current.offsetWidth - this.contentRef.current.clientWidth;
    }

    if (this.resourceRef && this.resourceRef.current) {
      resourceScrollbarHeight =
        this.resourceRef.current.offsetHeight - this.resourceRef.current.clientHeight;
      resourceScrollbarWidth =
        this.resourceRef.current.offsetWidth - this.resourceRef.current.clientWidth;
    }

    let states = {};
    let isStateChange = false;
    /*if (this.selfRef.current && this.state.schedulerWidth !== this.selfRef.current.offsetWidth) {
      console.log(this.state.schedulerWidth, this.selfRef.current.offsetWidth);
      const schedulerWidth = this.selfRef.current.offsetWidth;
      const resourceWidth = this.resolveResourceWidth();
      this.dataManger.recalDimensions(schedulerWidth, resourceWidth);
      this.source = this.dataManger.getSource();

      states = {
        ...states,
        resourceWidth,
        schedulerWidth,
      };
      isStateChange = true;
    }*/
    if (contentScrollbarHeight !== this.state.contentScrollbarHeight) {
      states = { ...states, contentScrollbarHeight };
      isStateChange = true;
    }
    if (contentScrollbarWidth !== this.state.contentScrollbarWidth) {
      states = { ...states, contentScrollbarWidth };
      isStateChange = true;
    }
    if (resourceScrollbarHeight !== this.state.resourceScrollbarHeight) {
      states = { ...states, resourceScrollbarHeight };
      isStateChange = true;
    }
    if (resourceScrollbarWidth !== this.state.resourceScrollbarWidth) {
      states = { ...states, resourceScrollbarWidth };
      isStateChange = true;
    }
    if (isStateChange) {
      this.setState(states);
    }
  };

  renderHeaderNavigator = () => {
    const dateTitle = this.dataManger.getDateTitle();
    const calendarPopoverEnabled = false;

    return (
      <Row type="flex" align="middle" justify="space-between">
        {this.props.leftCustomHeader}
        <Col>
          <div className="header2-text">
            <Icon
              type="left"
              style={{ marginRight: '8px' }}
              className="icon-nav"
              onClick={this.goBack}
            />
            {calendarPopoverEnabled ? (
              <Popover
                content={
                  <div className="popover-calendar">
                    <Calendar fullscreen={false} onSelect={this.handleDateSelect} />
                  </div>
                }
                placement="bottom"
                trigger="click"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
              >
                <span className={'header2-text-label'} style={{ cursor: 'pointer' }}>
                  {dateTitle}
                </span>
              </Popover>
            ) : (
              <span className={'header2-text-label'}>{dateTitle}</span>
            )}
            <Icon
              type="right"
              style={{ marginLeft: '8px' }}
              className="icon-nav"
              onClick={this.goNext}
            />
          </div>
        </Col>
        <Col>
          <TimePeriodSelector
            value={this.props.timePeriod}
            onChange={this.handleTimePeriodChange}
          />
        </Col>
        {this.props.rightCustomHeader}
      </Row>
    );
  };

  render() {
    const { config } = this.dataManger;
    // const calendarPopoverEnabled = config.calendarPopoverEnabled;

    let schedulerBody: JSX.Element;
    if (this.props.viewType === ViewTypes.Agenda) {
      schedulerBody = <AgendaView {...this.props} />;
    } else {
      /* const DndResourceEvents = this.state.dndContext.getDropTarget();
      / const eventDndSource = this.state.dndContext.getDndSource();

      const renderedEvents = this.dataManger.slots.filter(o => o.render);
      const resourceEventsList = renderedEvents.map(slot => {
      return (
        <DndResourceEvents
          {...this.props}
          key={slot.id}
          resourceEvents={slot}
          dndSource={eventDndSource}
        />
      );
    });

      const {
        contentScrollbarHeight,
        contentScrollbarWidth,
        resourceScrollbarHeight,
        resourceScrollbarWidth,
      } = this.state;
      const resourcePaddingBottom = resourceScrollbarHeight === 0 ? contentScrollbarHeight : 0;
      const contentPaddingBottom = contentScrollbarHeight === 0 ? resourceScrollbarHeight : 0;
      let schedulerContentStyle: React.CSSProperties = {
        paddingBottom: contentPaddingBottom,
        maxHeight: this.props.rowMaxHeight,
      };
      let resourceContentStyle: React.CSSProperties = {
        width: this.state.resourceWidth + resourceScrollbarWidth - 1,
        margin: `0px -${contentScrollbarWidth}px 0px 0px`,
        maxHeight: this.props.rowMaxHeight,
      };

      if (this.props.rowMaxHeight > 0) {
        schedulerContentStyle = {
          ...schedulerContentStyle,
          maxHeight: this.props.rowMaxHeight - this.props.headerHeight,
        };
        resourceContentStyle = {
          ...resourceContentStyle,
          maxHeight: this.props.rowMaxHeight - this.props.headerHeight,
        };
      }*/
    }

    return (
      <SchedulerContext.Provider
        value={{ source: { ...this.source, timePeriod: this.props.timePeriod } }}
      >
        <div
          ref={this.selfRef}
          id="rss_root"
          className="rss_container"
          style={{ width: this.isResponsive() ? this.props.width : `${this.props.width}px` }}
        >
          <div className="rss_navigator">
            {config.showNavigator ? this.renderHeaderNavigator() : null}
          </div>
          <div className="rss_scheduler">
            <div className="rss_resource_scroll" style={{ width: this.state.resourceWidth }}>
              <ResourceView text="Resource Name" width={this.source.dimensions.labelWidth} />
            </div>

            <DataView
              headerFormat={
                this.props.timePeriod === TimePeriods.Day
                  ? this.props.timeFormat
                  : this.props.dateFormat
              }
              width={this.source.dimensions.dataWidth - 1}
            />
          </div>
        </div>
      </SchedulerContext.Provider>
    );
  }
}
