import IObserver from './../observer/observer';

export interface IView {
  readonly data: IOptions;
  readonly events: IEvents;
  readonly sliderSize: ISliderSize;
  updateState(viewOptions: IOptions): void;
  changeHandlePosition(handle: THandle, position: number): void;
  emitCustomEvent(event: CustomEvent, target: keyof INodes): void;
}

export interface IOptions {
  type: TSliderType;
  orientation: TOrientation;
  fromFixed: boolean;
  toFixed: boolean;
}

export interface INodes {
  root: TRoot;
  track: HTMLDivElement;
  from: HTMLSpanElement;
  to: HTMLSpanElement;
  range: HTMLDivElement;
}

export interface IEvents {
  slideStart: IObserver<{handle: THandle}>;
  slideFinish: IObserver<{handle: THandle}>;
  slide: IObserver<{handle: THandle, coords: number}>;
}

export interface ISliderSize {
  height: number;
  width: number;
}

export enum TSliderType {
  single = 'single',
  'from-start' = 'from-start',
  'from-end' = 'from-end',
  double = 'double'}
export enum TOrientation { vertical = 'vertical', horizontal = 'horizontal' }
export type THandle = 'from' | 'to';
export type TEvent = MouseEvent | KeyboardEvent | TouchEvent | CustomEvent;
export type TRoot = HTMLDivElement | HTMLSpanElement;
