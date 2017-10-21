import IEvent from './../observer/observer';

export interface IModel {
  readonly data: IModelOptions;
  readonly event: IModelEvents;
}

export interface IModelOptions {
  type?: boolean;
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number;
}

export interface IModelEvents {
  fromChanged: IEvent,
  toChanged: IEvent,
}