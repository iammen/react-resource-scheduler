import { Component } from 'react';

export interface SchedulerProps {
  // Scheduler data
  data: any;

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
  constructor(props: SchedulerProps) {
    super(props);

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
  }

  render() {
    return null;
  }
}
