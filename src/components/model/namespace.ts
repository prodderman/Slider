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
  [key: string]: any;
}

export interface IEvents {
  fromChanged: IEvent;
  toChanged: IEvent;
}

export const initialOptions: IOptions = {
    type: false,
    min: 0,
    max: 100,
    from: 0,
    fromFixed: false,
    to: 0,
    toFixed: false,
    step: 1
};