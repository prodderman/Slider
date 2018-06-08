import IObserver from './../observer/observer';

export interface IView {
  readonly options: IOptions;
  readonly events: IEvents;
  readonly sliderSize: ISliderSize;
  updateOptions(viewOptions: IOptions): void;
  changeHandlePosition(handle: THandleType, position: number): void;
  emitCustomEvent(event: CustomEvent, target: keyof INodes): void;
}

export interface IOptions {
  type: TSliderType;
  orientation: TOrientation;
  hasRange: boolean;
  isFromFixed: boolean;
  isToFixed: boolean;
}

export interface INodes {
  root: TRoot;
  track: HTMLDivElement;
  from: HTMLSpanElement;
  to: HTMLSpanElement;
  range: HTMLDivElement;
}

export interface IEvents {
  slideStart: IObserver<{ handle: THandleType }>;
  slideFinish: IObserver<{ handle: THandleType }>;
  slide: IObserver<{ handle: THandleType, pixels: number }>;
}

export interface ISliderSize {
  height: number;
  width: number;
}

export enum TSliderType {
  'from-start' = 'from-start',
  'from-end' = 'from-end',
  'double' = 'double',
}
export enum TOrientation { vertical = 'vertical', horizontal = 'horizontal' }
export type THandleType = 'from' | 'to';
export type TEvent = MouseEvent | KeyboardEvent | TouchEvent | CustomEvent;
export type TRoot = HTMLDivElement | HTMLSpanElement;
