import IEvent from './../observer/observer';

export interface IViewOptions {
  type?: string; //single(default), min, max, double
  orientation? : string // horizontal(default), vertical
}

export interface IViewEvents {
  fromChanged: IEvent,
  toChanged: IEvent
}