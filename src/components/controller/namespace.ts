import { TSliderType, TOrientation } from '../view/namespace';

export interface IController {
  update: (callback: ICallbacks) => void;
}

export interface ICallbacks {
  onCreate: TCallback | null;
  onStart: TCallback | null;
  onSlide: TCallback | null;
  onEnd: TCallback | null;
  onUpdate: TCallback | null;
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

export type TCustomEvents =
  |'vanillastart' | 'vanillaend' | 'vanillaslide' | 'vanillaupdate' | 'vanillacreate';
export type TEvent = MouseEvent | KeyboardEvent | TouchEvent | CustomEvent;
export type TCallback = (event: Event, data: IModelViewData) => void;
