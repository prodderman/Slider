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
  from_fixed?: boolean;
  to?: number;
  to_fixed?: boolean;
  step?: number;
}

export interface IMandatoryOptions extends IModelOptions {
  type: boolean;
  min: number;
  max: number;
  from: number;
  from_fixed: boolean;
  to: number;
  to_fixed: boolean;
  step: number;
}

export interface IModelEvents {
  fromChanged: IEvent,
  toChanged: IEvent,
}