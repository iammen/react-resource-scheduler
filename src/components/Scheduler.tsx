import React, { Component, RefObject } from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Icon from 'antd/lib/icon';
import 'antd/lib/select/style/index.css';
import 'antd/lib/grid/style/index.css';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import 'antd/lib/radio/style/index.css';
import Popover from 'antd/lib/popover';
import 'antd/lib/popover/style/index.css';
import Calendar from 'antd/lib/calendar';
import 'antd/lib/calendar/style/index.css';
import BodyView from './BodyView';
import HeaderView from './HeaderView';
import ResourceView from './ResourceView';
// import AgendaView from './AgendaView';

import { SchedulerData } from '../ScdulerData';
import { SchedulerContext } from '../SchedulerContext';
import { getScrollSpecialMoment } from '../_util/getScrollSpecialMoment';
import { ViewRender } from '../interface';
import { ViewTypes, DisplayTypes } from '../enum';

export type ViewType = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
export type DisplayType = 'agenda' | 'resource' | 'task';

export interface Styles {
  cellWidth: number;
  headerHeight: number;
  maxHeight: number;
  slotHeaderWidth: number;
  slotHeight: number;
}

export interface SchedulerProps {
  agendaView?: React.ReactNode;
  besidesWidth: number;
  dataSource: SchedulerData;
  displayType: DisplayType;
  dndSources?: [];
  headerFormat: string;
  leftCustomHeader: React.ReactNode;
  rightCustomHeader: React.ReactNode;
  styles: Styles;
  viewEvent2Text?: string;
  viewEventText?: string;
  viewRender?: ViewRender;
  viewType?: ViewType;
  width?: number | string;

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
  nextClick: (data: SchedulerData) => void;
  onScrollBottom?: (data: SchedulerData, ref: RefObject<HTMLDivElement>, hight: number) => void;
  onScrollLeft?: (data: SchedulerData, ref: RefObject<HTMLDivElement>, width: number) => void;
  onScrollRight?: (data: SchedulerData, ref: RefObject<HTMLDivElement>, width: number) => void;
  onScrollTop?: (data: SchedulerData, ref: RefObject<HTMLDivElement>, hight: number) => void;
  onSelectDate: (data: SchedulerData, date: moment.Moment) => void;
  onSetAddMoreState?: () => void;
  onViewChange: (data: SchedulerData, view: any) => void;
  prevClick: (data: SchedulerData) => void;
  updateEventEnd?: () => void;
  updateEventStart?: () => void;
  viewEvent2Click?: () => void;
  viewEventClick?: () => void;
}

interface SchedulerStates {
  visible: boolean;
  dndContext?: any;
  contentHeight: number;
  contentScrollbarHeight: number;
  contentScrollbarWidth: number;
  resourceScrollbarHeight: number;
  resourceScrollbarWidth: number;
  scrollLeft: number;
  scrollTop: number;
  documentWidth: number;
  documentHeight: number;
}

export default class Scheduler extends Component<SchedulerProps, SchedulerStates> {
  static defaultProps = {
    agendaView: {},
    besidesWidth: 20,
    displayType: DisplayTypes.Task,
    headerFormat: 'ddd M/D',
    styles: {
      cellWidth: 40,
      headerHeight: 40,
      maxHeight: 0,
      slotHeaderWidth: 160,
      slotHeight: 40,
    },
    viewRender: {
      cellWidth: {
        day: 30,
        week: '12%',
        month: 80,
        quarter: 80,
        year: 80,
        custom: 80,
      },
      maxEvents: {
        day: 99,
        week: 99,
        month: 99,
        quarter: 99,
        year: 99,
        custom: 99,
      },
      resourceTableWidth: {
        day: 160,
        week: 160,
        month: 160,
        quarter: 160,
        year: 160,
        custom: 160,
      },
    },
    viewType: 'week',
  };

  static propTypes = {
    agendaView: PropTypes.node,
    besidesWidth: PropTypes.number,
    dataSource: PropTypes.instanceOf(SchedulerData).isRequired,
    displayType: PropTypes.string,
    dndSources: PropTypes.array,
    headerFormat: PropTypes.string,
    leftCustomHeader: PropTypes.node,
    rightCustomHeader: PropTypes.node,
    styles: PropTypes.object,
    viewRender: PropTypes.object,
    viewType: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  currentArea: number;

  contentRef: RefObject<HTMLDivElement>;

  headRef: RefObject<HTMLDivElement>;

  resourceRef: RefObject<HTMLDivElement>;

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
      visible: false,
      dndContext: undefined,
      contentHeight: 0,
      contentScrollbarHeight: 17,
      contentScrollbarWidth: 17,
      resourceScrollbarHeight: 17,
      resourceScrollbarWidth: 17,
      scrollLeft: 0,
      scrollTop: 0,
      documentWidth: document.documentElement.clientWidth,
      documentHeight: document.documentElement.clientHeight,
    };

    this.contentRef = React.createRef();
    this.headRef = React.createRef();
    this.resourceRef = React.createRef();
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

    const { dataSource } = this.props;
    if (dataSource.getScrollToSpecialMoment()) {
      if (
        this.contentRef &&
        this.contentRef.current &&
        this.contentRef.current.scrollWidth > this.contentRef.current.clientWidth
      ) {
        const { localeMoment } = dataSource;
        const start = localeMoment(dataSource.startDate).startOf('day');
        const end = localeMoment(dataSource.endDate).endOf('day');
        const specialMoment = getScrollSpecialMoment(dataSource, start, end);
        if (specialMoment >= start && specialMoment <= end) {
          let index = 0;
          dataSource.headers.forEach(item => {
            const header = localeMoment(item.time);
            if (specialMoment >= header) {
              index++;
            }
          });
          this.contentRef.current.scrollLeft = (index - 1) * Number(this.getContentCellWidth());

          dataSource.setScrollToSpecialMoment(false);
        }
      }
    }
  }

  getCellWidthProp() {
    const { viewRender, viewType } = this.props;

    if (viewRender) {
      return (
        Number(
          viewType === ViewTypes.Week
            ? viewRender.cellWidth.week
            : viewType === ViewTypes.Day
            ? viewRender.cellWidth.day
            : viewType === ViewTypes.Month
            ? viewRender.cellWidth.month
            : viewType === ViewTypes.Year
            ? viewRender.cellWidth.year
            : viewType === ViewTypes.Quarter
            ? viewRender.cellWidth.quarter
            : viewRender.cellWidth.custom,
        ) || 17
      );
    }

    return 17;
  }

  getContentCellWidth() {
    const componentWidth = this.getSchedulerCompWidth();
    const contentCellConfigWidth = this.getCellWidthProp();
    return this.isContentResponsive()
      ? (Number(componentWidth) * Number((contentCellConfigWidth || 0).toString().slice(0, -1))) /
          100
      : Number(contentCellConfigWidth);
  }

  getContentCompWidth() {
    return this.props.dataSource.headers.length * this.getContentCellWidth();
  }

  getContentDesiredHeight() {
    let height = 0;
    this.props.dataSource.slots.forEach(slot => {
      if (slot.render) {
        height += slot.rowHeight;
      }
    });

    return height;
  }

  getResourceCompWidth() {
    const resourceTableWidthProp = this.getResourceTableWidthProp();
    const componentWidth = this.getSchedulerCompWidth();
    let resourceTableWidth = this.isResourceResponsive()
      ? (componentWidth * Number(resourceTableWidthProp.toString().slice(0, -1))) / 100
      : resourceTableWidthProp;
    if (this.isResponsive() && this.getContentCompWidth() + resourceTableWidth < componentWidth) {
      resourceTableWidth = componentWidth - this.getContentCompWidth();
    }
    return resourceTableWidth;
  }

  getResourceTableWidthProp() {
    const { viewType, viewRender } = this.props;
    /* if (this.showAgenda) {
      return this.config.agendaResourceTableWidth;
    } */

    if (viewRender) {
      return (
        Number(
          viewType === ViewTypes.Day
            ? viewRender.resourceTableWidth.day
            : viewType === ViewTypes.Week
            ? viewRender.resourceTableWidth.week
            : viewType === ViewTypes.Month
            ? viewRender.resourceTableWidth.month
            : viewType === ViewTypes.Year
            ? viewRender.resourceTableWidth.year
            : viewType === ViewTypes.Quarter
            ? viewRender.resourceTableWidth.quarter
            : viewRender.resourceTableWidth.custom,
        ) || 160
      );
    }

    return 160;
  }

  getSchedulerCompWidth() {
    const width = this.props.width || this.state.documentWidth;
    const baseWidth =
      this.state.documentWidth - this.props.besidesWidth > 0
        ? this.state.documentWidth - this.props.besidesWidth
        : 0;
    return this.isResponsive()
      ? Number(baseWidth * Number(width.toString().slice(0, -1))) / 100
      : Number(width);
  }

  goNext = () => {
    this.props.nextClick(this.props.dataSource);
  };

  goBack = () => {
    this.props.prevClick(this.props.dataSource);
  };

  handleContentMouseOut = () => {
    this.currentArea = -1;
  };

  handleContentMouseOver = () => {
    this.currentArea = 0;
  };

  handleContentScroll = () => {
    if (this.contentRef.current && this.headRef.current && this.resourceRef.current) {
      const { dataSource, onScrollLeft, onScrollRight, onScrollTop, onScrollBottom } = this.props;
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
            dataSource,
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
            dataSource,
            this.contentRef,
            this.contentRef.current.scrollWidth - this.contentRef.current.clientWidth,
          );
        }
      } else if (this.contentRef.current.scrollTop !== scrollTop) {
        if (this.contentRef.current.scrollTop === 0 && onScrollTop) {
          onScrollTop(
            dataSource,
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
            dataSource,
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

      this.props.onSelectDate(this.props.dataSource, date);
    }
  };

  handleViewChange = (e: RadioChangeEvent) => {
    const args = e.target.value.split(':');
    const viewType = args[0];
    const showAgenda = args[1] === '1';
    const isEventPerspective = args[2] === '1';
    this.props.onViewChange(this.props.dataSource, { viewType, showAgenda, isEventPerspective });
  };

  handleVisibleChange = (visible: boolean) => {
    this.setState({ visible });
  };

  handleWindowResize = (e: UIEvent) => {
    this.setState({
      documentWidth: document.documentElement.clientWidth,
      documentHeight: document.documentElement.clientHeight,
    });
  };

  isContentResponsive() {
    const contentCellWidth = this.getCellWidthProp();
    return contentCellWidth.toString().endsWith('%');
  }

  isResponsive() {
    return typeof this.props.width === 'string' && this.props.width.endsWith('%');
  }

  isResourceResponsive() {
    const resourceTableWidth = this.getResourceTableWidthProp();
    return resourceTableWidth.toString().endsWith('%');
  }

  resolveScrollbarSize = () => {
    let contentScrollbarHeight = 17;
    let contentScrollbarWidth = 17;
    let resourceScrollbarHeight = 17;
    let resourceScrollbarWidth = 17;
    let contentHeight = this.getContentDesiredHeight();

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
      contentHeight = this.tableBodyRef.current.offsetHeight;
    }

    let states = {};
    let isStateChange = false;
    if (contentScrollbarHeight !== this.state.contentScrollbarHeight) {
      states = { ...states, contentScrollbarHeight };
      isStateChange = true;
    }
    if (contentScrollbarWidth !== this.state.contentScrollbarWidth) {
      states = { ...states, contentScrollbarWidth };
      isStateChange = true;
    }
    if (contentHeight !== this.state.contentHeight) {
      states = { ...states, contentHeight };
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
    const { dataSource, leftCustomHeader, rightCustomHeader, styles } = this.props;
    const { slots, viewType, showAgenda, isEventPerspective, config } = dataSource;
    const width = this.getSchedulerCompWidth();
    const calendarPopoverEnabled = config.calendarPopoverEnabled;

    const dateLabel = dataSource.getDateLabel();
    const defaultValue = `${viewType}${showAgenda ? 1 : 0}${isEventPerspective ? 1 : 0}`;
    const radioButtonList = config.views.map(item => {
      return (
        <Radio.Button
          key={`${item.viewType}${item.showAgenda ? 1 : 0}${item.isEventPerspective ? 1 : 0}`}
          value={`${item.viewType}${item.showAgenda ? 1 : 0}${item.isEventPerspective ? 1 : 0}`}
        >
          (<span style={{ margin: '0px 8px' }}>{item.viewName}</span>)
        </Radio.Button>
      );
    });

    let tbodyContent: JSX.Element;
    /* if (showAgenda) {
      tbodyContent = <AgendaView {...this.props} />;
    } else { */
    const resourceTableWidth = this.getResourceCompWidth();
    const schedulerContainerWidth = width - resourceTableWidth + 1;
    const schedulerWidth = this.getContentCompWidth() - 1;
    const DndResourceEvents = this.state.dndContext.getDropTarget();
    const eventDndSource = this.state.dndContext.getDndSource();

    const displayRenderData = slots.filter(o => o.render);
    const resourceEventsList = displayRenderData.map(slot => {
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
      contentHeight,
      contentScrollbarHeight,
      contentScrollbarWidth,
      resourceScrollbarHeight,
      resourceScrollbarWidth,
    } = this.state;
    const resourcePaddingBottom = resourceScrollbarHeight === 0 ? contentScrollbarHeight : 0;
    const contentPaddingBottom = contentScrollbarHeight === 0 ? resourceScrollbarHeight : 0;
    let schedulerContentStyle: React.CSSProperties = {
      overflow: 'auto',
      margin: '0px',
      position: 'relative',
      paddingBottom: contentPaddingBottom,
      maxHeight: styles.maxHeight,
    };
    let resourceContentStyle: React.CSSProperties = {
      overflowX: 'auto',
      overflowY: 'auto',
      width: resourceTableWidth + resourceScrollbarWidth - 2,
      margin: `0px -${contentScrollbarWidth}px 0px 0px`,
      maxHeight: styles.maxHeight,
    };

    if (styles.maxHeight > 0) {
      schedulerContentStyle = {
        ...schedulerContentStyle,
        maxHeight: styles.maxHeight - styles.headerHeight,
      };
      resourceContentStyle = {
        ...resourceContentStyle,
        maxHeight: styles.maxHeight - styles.headerHeight,
      };
    }

    const resourceName = dataSource.isEventPerspective
      ? dataSource.config.taskName
      : dataSource.config.resourceName;
    tbodyContent = (
      <tr>
        <td style={{ width: resourceTableWidth, verticalAlign: 'top' }}>
          <div className="resource-view">
            <div
              style={{
                overflow: 'hidden',
                borderBottom: '1px solid #e9e9e9',
                height: config.tableHeaderHeight,
              }}
            >
              <div
                style={{
                  overflowX: 'scroll',
                  overflowY: 'hidden',
                  margin: `0px 0px -${contentScrollbarHeight}px`,
                }}
              >
                <table className="resource-table">
                  <thead>
                    <tr style={{ height: config.tableHeaderHeight }}>
                      <th className="header3-text">{resourceName}</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div
              style={resourceContentStyle}
              ref={this.resourceRef}
              onMouseOver={this.handleResourceMouseOver}
              onMouseOut={this.handleResourceMouseOut}
              onScroll={this.handleResourceScroll}
            >
              <ResourceView contentScrollbarHeight={resourcePaddingBottom} />
            </div>
          </div>
        </td>
        <td>
          <div
            className="scheduler-view"
            style={{ width: schedulerContainerWidth, verticalAlign: 'top' }}
          >
            <div
              style={{
                overflow: 'hidden',
                borderBottom: '1px solid #e9e9e9',
                height: config.tableHeaderHeight,
              }}
            >
              <div
                style={{
                  overflowX: 'scroll',
                  overflowY: 'hidden',
                  margin: `0px 0px -${contentScrollbarHeight}px`,
                }}
                ref={this.headRef}
                onMouseOver={this.handleHeadMouseOver}
                onMouseOut={this.handleHeadMouseOut}
                onScroll={this.handleHeadScroll}
              >
                <div
                  style={{
                    paddingRight: `${contentScrollbarWidth}px`,
                    width: schedulerWidth + contentScrollbarWidth,
                  }}
                >
                  <table className="scheduler-bg-table">
                    <HeaderView
                      format={this.props.headerFormat}
                      height={styles.headerHeight}
                      width={styles.slotHeaderWidth}
                    />
                  </table>
                </div>
              </div>
            </div>
            <div
              style={schedulerContentStyle}
              ref={this.contentRef}
              onMouseOver={this.handleContentMouseOver}
              onMouseOut={this.handleContentMouseOut}
              onScroll={this.handleContentScroll}
            >
              <div style={{ width: schedulerWidth, height: contentHeight }}>
                <div className="scheduler-content">
                  <table className="scheduler-content-table">
                    <tbody>{resourceEventsList}</tbody>
                  </table>
                </div>
                <div className="scheduler-bg">
                  <table
                    className="scheduler-bg-table"
                    style={{ width: schedulerWidth }}
                    ref={this.tableBodyRef}
                  >
                    <BodyView cellWidth={styles.cellWidth} />
                  </table>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
    // }

    const popover = (
      <div className="popover-calendar">
        <Calendar fullscreen={false} onSelect={this.handleDateSelect} />
      </div>
    );
    let schedulerHeader = <div />;
    if (config.headerEnabled) {
      schedulerHeader = (
        <Row type="flex" align="middle" justify="space-between" style={{ marginBottom: '24px' }}>
          {leftCustomHeader}
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
                    {dateLabel}
                  </span>
                </Popover>
              ) : (
                <span className={'header2-text-label'}>{dateLabel}</span>
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
            <Radio.Group
              defaultValue={defaultValue}
              size="default"
              onChange={this.handleViewChange}
            >
              {radioButtonList}
            </Radio.Group>
          </Col>
          {rightCustomHeader}
        </Row>
      );
    }

    return (
      <SchedulerContext.Provider value={{ source: dataSource, styles: this.props.styles }}>
        <table id="RBS-Scheduler-root" className="scheduler" style={{ width: `${width}px` }}>
          <thead>
            <tr>
              <td colSpan={2}>{schedulerHeader}</td>
            </tr>
          </thead>
          <tbody>{tbodyContent}</tbody>
        </table>
      </SchedulerContext.Provider>
    );
  }
}
