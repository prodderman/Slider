import IObserver from './../observer/observer';

export interface IModel {
  readonly data: IOptions;
  readonly events: IEvents;
  updateState(options: IOptions): void;
  updateHandleValue(handle: THandle, rawHandleValue: number): void;
}

export interface IOptions {
  type: boolean;
  min: number;
  max: number;
  from: number;
  fromFixed: boolean;
  to: number;
  toFixed: boolean;
  step: number;
}

export interface IEvents {
  stateChanged: IObserver<{ handle: THandle, value: number }>;
}

export type THandle = 'from' | 'to';
