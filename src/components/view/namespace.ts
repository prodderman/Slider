import IEvent from './../observer/observer';

export interface IView {
  readonly data: IOptions;
  readonly events: IEvents;
  readonly nodesData: INodes;
  readonly rootObject: TRoot;
  update: (viewOptions: IOptions) => void;
  calcFrom: (from: number) => void;
  calcTo: (to: number) => void;
}

export interface IOptions {
  type: TSliderType;
  orientation: TOrientation;
  fromFixed: boolean;
  toFixed: boolean;
}

export interface INodes {
  track: HTMLDivElement;
  from: HTMLSpanElement;
  to: HTMLSpanElement;
  range: HTMLDivElement;
}

export interface IEvents {
  slideStart: IEvent;
  slideEnd: IEvent;
  fromChanged: IEvent;
  toChanged: IEvent;
}

export type TSliderType = 'single' | 'from-start' | 'from-end' | 'double';
export type TOrientation = 'vertical' | 'horizontal';
export type TRoot = HTMLDivElement | HTMLSpanElement;
