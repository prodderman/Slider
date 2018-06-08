import IObserver from './../observer/observer';

export interface IModel {
  readonly options: IOptions;
  readonly state: IState;
  readonly events: IEvents;
  updateOptions(options: IOptions): void;
  updateState(state: Partial<IState>): void;
}

export interface IOptions {
  isDouble: boolean;
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
}

export interface IState {
  from: number;
  to: number;
}

export interface IEvents {
  stateChanged: IObserver<{ handle: THandleType, value: number }>;
}

export type THandleType = 'from' | 'to';
export type Partial<T> = { [P in keyof T]?: T[P]; };
