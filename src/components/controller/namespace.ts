import { TCallback } from './../../namespace';

export interface IControllerOptions {
  onCreate?: TCallback;
  onStart?: TCallback;
  onSlide?: TCallback;
  onEnd?: TCallback;
  onUpdate?: TCallback;
}