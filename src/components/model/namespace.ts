import IEvent from './../observer/observer';

export interface IModel {
  readonly data: IMandatoryOptions;
  readonly events: IModelEvents;
}

export interface IModelOptions {
  type?: boolean;
  min?: number;
  max?: number;
  from?: number;
  fromFixed?: boolean;
  to?: number;
  toFixed?: boolean;
  step?: number;
  [key: string]: number | boolean | undefined;
}

export interface IMandatoryOptions {
  type: boolean;
  min: number;
  max: number;
  from: number;
  fromFixed: boolean;
  to: number;
  toFixed: boolean;
  step: number;
}

export interface IModelEvents {
  fromChanged: IEvent;
  toChanged: IEvent;
}