import { TSliderType, TOrientation } from '../view/namespace';

export interface ICallbacks {
  onCreate: TCallback | null;
  onStart: TCallback | null;
  onSlide: TCallback | null;
  onEnd: TCallback | null;
  onUpdate: TCallback | null;
  [key: string]: TCallback | null;
}

export type event = MouseEvent | KeyboardEvent | TouchEvent | CustomEvent;

export interface CustomEvents {
  create: event;
  start: event;
  slide: event;
  end: event;
  update: event;
  [key: string]: event;
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

export const initialOptions: ICallbacks = {
  onCreate: null,
  onStart: null,
  onSlide: null,
  onEnd: null,
  onUpdate: null
};

export const initialCustomEvents: CustomEvents = {
  create: new CustomEvent('vanillacreate'),
  start: new CustomEvent('vanillastart'),
  slide: new CustomEvent('vanillaslide'),
  end: new CustomEvent('vanillaend'),
  update: new CustomEvent('vanillaupdate'),
};
