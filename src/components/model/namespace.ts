import IEvent from './../observer/observer';

export interface IModel {
  readonly data: IOptions;
  readonly events: IEvents;
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
  fromChanged: IEvent;
  toChanged: IEvent;
}
