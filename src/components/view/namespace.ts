import IEvent from './../observer/observer';

export interface IViewOptions {
  type?: string; //single(default), min, max, double
  orientation? : string // horizontal(default), vertical
  from_fixed? : boolean;
  to_fixed?: boolean;
}

export interface IViewEvents {
  slideStart: IEvent;
  slideEnd: IEvent;
  fromChanged: IEvent;
  toChanged: IEvent;
}