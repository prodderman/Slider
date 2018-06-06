import { TSliderType, TOrientation } from '../view/namespace';

export interface ICallbacks {
  onCreate: TCallback | null;
  onStart: TCallback | null;
  onSlide: TCallback | null;
  onEnd: TCallback | null;
  onUpdate: TCallback | null;
}

export type TEvent = MouseEvent | KeyboardEvent | TouchEvent | CustomEvent;

export interface CustomEvents {
  create: TEvent;
  start: TEvent;
  slide: TEvent;
  end: TEvent;
  update: TEvent;
}

export interface IModelViewData {
  type?: TSliderType;
  orientation?: TOrientation;
  min?: number;
  max?: number;
  from?: number;
  fromFixed?: boolean;
  to?: number;
  toFixed?: boolean;
  step?: number;
}

export type TCallback = (event: Event, data: IModelViewData) => void;
