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

export interface IClientData {
  from: number;
  to: number;
}

export type TCustomEvents =
  |'vanillastart' | 'vanillafinish' | 'vanillaslide' | 'vanillaupdate' | 'vanillacreate';
export type TCallback = (event: Event, data: IClientData) => void;
