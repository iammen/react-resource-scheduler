import React, { Component, RefObject } from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Icon from 'antd/lib/icon';
import { RadioChangeEvent } from 'antd/lib/radio';
import Popover from 'antd/lib/popover';
import Calendar from 'antd/lib/calendar';
import BodyView from './BodyView';
import DataHeaderView from './DataHeaderView';
import ResourceView from './ResourceView';
import AgendaView from './AgendaView';
import { TimePeriodSelector } from './TimePeriodSelector';

import 'antd/lib/select/style/index.css';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/popover/style/index.css';
import 'antd/lib/calendar/style/index.css';
import './less/style.less';

import { SchedulerContext } from './SchedulerContext';
import { getScrollSpecialMoment } from './_util/getScrollSpecialMoment';
import { Event, Resource } from './interface';
import { TimePeriods, ViewTypes } from './enum';
import { SchedulerDataManger } from './SchedulerDataManager';
import { DATE_FORMAT } from './constants';

export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
export type ViewType = 'agenda' | 'timeline' | 'day' | 'week' | 'month' | 'map';

export interface Styles {
  cellWidth: number;
  headerHeight: number;
  maxHeight: number;
  slotHeaderWidth: number;
  slotHeight: number;
}

export interface SchedulerProps {
  agendaView?: React.ReactNode;
  currentDate: string;
  viewType: ViewType;
  dndSources?: [];
  events: Event[];
  dateFormat: string;
  language: string;
  timeFormat: string;
  leftCustomHeader: React.ReactNode;
  locale: string;
  resources: Resource[];
  resourceWidth: number | string;
  rightCustomHeader: React.ReactNode;
  styles: Styles;
  timePeriod: TimePeriod;
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
  onViewChange?: (data: SchedulerDataManger, view: any) => void;
  prevClick: (data: SchedulerDataManger) => void;
  updateEventEnd?: () => void;
  updateEventStart?: () => void;
  viewEvent2Click?: () => void;
  viewEventClick?: () => void;
}

interface SchedulerStates {
  actualResourceWidth: number;
  actualSchedulerWidth: number;
  availableCellWidth: number;
  contentHeight: number;
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
    currentDate: moment().format(DATE_FORMAT),
    dateFormat: `ddd\nM/D`,
    language: 'en',
    leftCustomHeader: undefined,
    locale: 'en',
    resourceWidth: 200,
    rightCustomHeader: undefined,
    styles: {
      cellWidth: 40,
      headerHeight: 40,
      maxHeight: 768,
      slotHeaderWidth: 160,
      slotHeight: 40,
    },
    timeFormat: 'ha',
    timePeriod: 'week',
    viewType: 'timeline',
    width: '100%',
  };

  static propTypes = {
    agendaView: PropTypes.node,
    dateFormat: PropTypes.string,
    timePeriod: PropTypes.string,
    dndSources: PropTypes.array,
    leftCustomHeader: PropTypes.node,
    rightCustomHeader: PropTypes.node,
    styles: PropTypes.object,
    timeFormat: PropTypes.string,
    viewType: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  currentArea: number;

  contentRef: RefObject<HTMLDivElement>;

  dataManger: SchedulerDataManger;

  headRef: RefObject<HTMLDivElement>;

  resourceRef: RefObject<HTMLDivElement>;

  selfRef: RefObject<HTMLDivElement>;

  tableBodyRef: RefObject<HTMLTableElement>;

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

    this.state = {
      actualResourceWidth: 0,
      actualSchedulerWidth: 0,
      availableCellWidth: 0,
      contentHeight: 0,
      contentScrollbarHeight: 17,
      contentScrollbarWidth: 17,
      dndContext: undefined,
      resourceScrollbarHeight: 17,
      resourceScrollbarWidth: 17,
      scrollLeft: 0,
      scrollTop: 0,
      visible: false,
    };

    this.dataManger = new SchedulerDataManger({
      currentDate: props.currentDate,
      language: props.language,
      timePeriod: props.timePeriod,
      events: props.events,
      resources: props.resources,
    });

    this.contentRef = React.createRef();
    this.headRef = React.createRef();
    this.resourceRef = React.createRef();
    this.selfRef = React.createRef();
    this.tableBodyRef = React.createRef();

    if (this.isResponsive()) {
      window.onresize = this.handleWindowResize;
    }
  }

  componentDidMount() {
    this.resolveScrollbarSize();
  }

  componentDidUpdate() {
    this.resolveScrollbarSize();

    if (this.dataManger.getScrollToSpecialMoment()) {
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
    }
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

  handleViewChange = (e: RadioChangeEvent) => {
    const timePeriod = e.target.value;

    if (this.props.onViewChange) {
      this.props.onViewChange(this.dataManger, { timePeriod });
    }
  };

  handleVisibleChange = (visible: boolean) => {
    this.setState({ visible });
  };

  handleWindowResize = () => {
    this.resolveScrollbarSize();
  };

  isResponsive() {
    return typeof this.props.width === 'string' && this.props.width.endsWith('%');
  }

  isResourceResponsive() {
    return this.props.resourceWidth.toString().endsWith('%');
  }

  resolveBodyDesiredHeight() {
    let height = 0;
    this.dataManger.slots.forEach(slot => {
      if (slot.render) {
        height += slot.height;
      }
    });

    return height;
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
    let bodyHeight = this.resolveBodyDesiredHeight();

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

    if (this.tableBodyRef && this.tableBodyRef.current) {
      bodyHeight = this.tableBodyRef.current.offsetHeight;
    }

    let states = {};
    let isStateChange = false;
    if (
      this.selfRef.current &&
      this.state.actualSchedulerWidth !== this.selfRef.current.clientWidth
    ) {
      const actualSchedulerWidth = this.selfRef.current.clientWidth;
      const actualResourceWidth = this.resolveResourceWidth();
      this.dataManger.recalDimensions(actualSchedulerWidth, actualResourceWidth);

      states = {
        ...states,
        actualResourceWidth,
        actualSchedulerWidth,
        availableCellWidth:
          actualResourceWidth + this.dataManger.dimensions.dataLength >
          this.selfRef.current.clientWidth
            ? this.selfRef.current.clientWidth - actualResourceWidth
            : this.dataManger.dimensions.dataLength,
      };
      isStateChange = true;
    }
    if (contentScrollbarHeight !== this.state.contentScrollbarHeight) {
      states = { ...states, contentScrollbarHeight };
      isStateChange = true;
    }
    if (contentScrollbarWidth !== this.state.contentScrollbarWidth) {
      states = { ...states, contentScrollbarWidth };
      isStateChange = true;
    }
    if (bodyHeight !== this.state.contentHeight) {
      states = { ...states, contentHeight: bodyHeight };
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

  render() {
    const { config } = this.dataManger;
    const calendarPopoverEnabled = config.calendarPopoverEnabled;
    const dateTitle = this.dataManger.getDateTitle();

    let schedulerBody: JSX.Element;
    if (this.props.viewType === ViewTypes.Agenda) {
      schedulerBody = <AgendaView {...this.props} />;
    } else {
      // const DndResourceEvents = this.state.dndContext.getDropTarget();
      // const eventDndSource = this.state.dndContext.getDndSource();

      const renderedEvents = this.dataManger.slots.filter(o => o.render);
      /* const resourceEventsList = renderedEvents.map(slot => {
      return (
        <DndResourceEvents
          {...this.props}
          key={slot.id}
          resourceEvents={slot}
          dndSource={eventDndSource}
        />
      );
    }); */

      const {
        contentHeight,
        contentScrollbarHeight,
        contentScrollbarWidth,
        resourceScrollbarHeight,
        resourceScrollbarWidth,
      } = this.state;
      const resourcePaddingBottom = resourceScrollbarHeight === 0 ? contentScrollbarHeight : 0;
      const contentPaddingBottom = contentScrollbarHeight === 0 ? resourceScrollbarHeight : 0;
      let schedulerContentStyle: React.CSSProperties = {
        paddingBottom: contentPaddingBottom,
        maxHeight: this.props.styles.maxHeight,
      };
      let resourceContentStyle: React.CSSProperties = {
        width: this.state.actualResourceWidth + resourceScrollbarWidth - 1,
        margin: `0px -${contentScrollbarWidth}px 0px 0px`,
        maxHeight: this.props.styles.maxHeight,
      };

      if (this.props.styles.maxHeight > 0) {
        schedulerContentStyle = {
          ...schedulerContentStyle,
          maxHeight: this.props.styles.maxHeight - this.props.styles.headerHeight,
        };
        resourceContentStyle = {
          ...resourceContentStyle,
          maxHeight: this.props.styles.maxHeight - this.props.styles.headerHeight,
        };
      }

      const resourceName =
        this.dataManger.yAxisDataType === 'resource'
          ? this.dataManger.config.taskName
          : this.dataManger.config.resourceName;
      schedulerBody = (
        <div>
          <div className="rss_resource_scroll" style={{ width: this.state.actualResourceWidth }}>
            <div className="rss_resource_container">
              <div
                className="rss_resource_header"
                style={{
                  height: this.props.styles.headerHeight,
                }}
              >
                <table className="rss_resource_table">
                  <thead>
                    <tr style={{ height: this.props.styles.headerHeight }}>
                      <th className="header3-text">{resourceName}</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div
                style={resourceContentStyle}
                ref={this.resourceRef}
                onMouseOver={this.handleResourceMouseOver}
                onMouseOut={this.handleResourceMouseOut}
                onScroll={this.handleResourceScroll}
              >
                <ResourceView scrollbarHeight={resourcePaddingBottom} />
              </div>
            </div>
          </div>
          <div className="rss_data_scroll" style={{ width: this.state.availableCellWidth }}>
            <div
              className="rss_data_container"
              style={{ width: this.dataManger.dimensions.dataLength - 1 }}
            >
              <div
                className="rss_data_header"
                style={{
                  height: this.props.styles.headerHeight,
                }}
              >
                <div
                  style={{
                    width: this.dataManger.dimensions.dataLength,
                    margin: `0px 0px -${contentScrollbarHeight}px`,
                  }}
                  ref={this.headRef}
                  onMouseOver={this.handleHeadMouseOver}
                  onMouseOut={this.handleHeadMouseOut}
                  onScroll={this.handleHeadScroll}
                >
                  <DataHeaderView
                    format={
                      this.props.timePeriod === TimePeriods.Day
                        ? this.props.timeFormat
                        : this.props.dateFormat
                    }
                    height={this.props.styles.headerHeight}
                    width={this.dataManger.dimensions.dataLength}
                  />
                </div>
              </div>
              <div
                className="rss_data_body"
                style={schedulerContentStyle}
                ref={this.contentRef}
                onMouseOver={this.handleContentMouseOver}
                onMouseOut={this.handleContentMouseOut}
                onScroll={this.handleContentScroll}
              >
                <div
                  style={{
                    margin: 0,
                    width: this.dataManger.dimensions.dataLength,
                    height: contentHeight,
                  }}
                >
                  <div className="rss_movable_container">
                    <table className="event-table">
                      <tbody>{/*resourceEventsList*/ null}</tbody>
                    </table>
                  </div>
                  <div className="rss_yaxis_container">
                    <table className="rss_yaxis_table" ref={this.tableBodyRef}>
                      <BodyView width={this.dataManger.dimensions.dataLength} />
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const popover = (
      <div className="popover-calendar">
        <Calendar fullscreen={false} onSelect={this.handleDateSelect} />
      </div>
    );
    let schedulerHeader = <div />;
    if (config.showNavigator) {
      schedulerHeader = (
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
                  content={popover}
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
            <TimePeriodSelector value={this.props.timePeriod} onChange={this.handleViewChange} />
          </Col>
          {this.props.rightCustomHeader}
        </Row>
      );
    }

    return (
      <SchedulerContext.Provider value={{ source: this.dataManger, styles: this.props.styles }}>
        <div
          ref={this.selfRef}
          id="rss_root"
          className="rss_container"
          style={{ width: this.isResponsive() ? this.props.width : `${this.props.width}px` }}
        >
          <div className="rss_navigator">{schedulerHeader}</div>
          <div className="rss_scheduler">{schedulerBody}</div>
        </div>
      </SchedulerContext.Provider>
    );
  }
}
