import { TSliderType, TOrientation } from '../view/namespace';

export interface IController {
  updateClientsCallbacks(callbacks: ICallbacks): void;
}

export interface ICallbacks {
  onCreate: TCallback | null;
  onSlideStart: TCallback | null;
  onSlide: TCallback | null;
  onSlideFinish: TCallback | null;
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
  |'vanillastart' | 'vanillafinish' | 'vanillaslide' | 'vanillaupdate' | 'vanillacreate';
export type TCallback = (event: Event, data: IModelViewData) => void;
