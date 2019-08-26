import React, { Component, RefObject } from 'react';
import { SchedulerData } from '../ScdulerData';
import { getScrollSpecialMoment } from '../_util/getScrollSpecialMoment';

export interface SchedulerProps {
  // Scheduler data
  dataSource: SchedulerData;

  // Event handlers
  prevClick: () => void;
  nextClick: () => void;
  updateEventStart?: () => void;
  updateEventEnd?: () => void;
  moveEvent?: () => void;
  movingEvent?: () => void;
  newEvent?: () => void;
  eventItemClick?: () => void;
  viewEventClick?: () => void;
  viewEvent2Click?: () => void;

  leftCustomHeader?: any;
  rightCustomHeader?: any;
  subtitleGetter?: () => void;
  viewEventText?: string;
  viewEvent2Text?: string;
  conflictOccurred?: () => void;
  eventItemTemplateResolver?: () => void;
  dndSources?: [];
  slotClickedFunc?: () => void;
  toggleExpandFunc?: () => void;
  slotItemTemplateResolver?: () => void;
  nonAgendaCellHeaderTemplateResolver?: () => void;

  onScrollBottom?: () => void;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  onScrollTop?: () => void;
  onSelectDate: () => void;
  onSetAddMoreState?: () => void;
  onViewChange: () => void;
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
  currentArea: number;

  schedulerContent: RefObject<HTMLDivElement>;

  schedulerResource: RefObject<HTMLDivElement>;

  schedulerTableBody: RefObject<HTMLTableElement>;

  constructor(props: SchedulerProps) {
    super(props);

    const { dataSource, dndSources } = props;
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
    dataSource.setDocumentWidth(document.documentElement.clientWidth);

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

    this.schedulerContent = React.createRef();
    this.schedulerResource = React.createRef();
    this.schedulerTableBody = React.createRef();

    if (dataSource.isSchedulerResponsive()) {
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
        this.schedulerContent &&
        this.schedulerContent.current &&
        this.schedulerContent.current.scrollWidth > this.schedulerContent.current.clientWidth
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
          this.schedulerContent.current.scrollLeft =
            (index - 1) * Number(dataSource.getContentCellWidth());

          dataSource.setScrollToSpecialMoment(false);
        }
      }
    }
  }

  handleWindowResize = (e: UIEvent) => {
    const { dataSource } = this.props;
    dataSource.setDocumentWidth(document.documentElement.clientWidth);
    this.setState({
      documentWidth: document.documentElement.clientWidth,
      documentHeight: document.documentElement.clientHeight,
    });
  };

  resolveScrollbarSize = () => {
    const { dataSource } = this.props;
    let contentScrollbarHeight = 17;
    let contentScrollbarWidth = 17;
    let resourceScrollbarHeight = 17;
    let resourceScrollbarWidth = 17;
    let contentHeight = dataSource.getSchedulerContentDesiredHeight();

    if (this.schedulerContent && this.schedulerContent.current) {
      contentScrollbarHeight =
        this.schedulerContent.current.offsetHeight - this.schedulerContent.current.clientHeight;
      contentScrollbarWidth =
        this.schedulerContent.current.offsetWidth - this.schedulerContent.current.clientWidth;
    }

    if (this.schedulerResource && this.schedulerResource.current) {
      resourceScrollbarHeight =
        this.schedulerResource.current.offsetHeight - this.schedulerResource.current.clientHeight;
      resourceScrollbarWidth =
        this.schedulerResource.current.offsetWidth - this.schedulerResource.current.clientWidth;
    }

    if (this.schedulerTableBody && this.schedulerTableBody.current) {
      contentHeight = this.schedulerTableBody.current.offsetHeight;
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
    return null;
  }
}
