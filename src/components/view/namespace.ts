import IEvent from './../observer/observer';

export interface IViewOptions {
  type?: Types;
  orientation? : Orient;
  from_fixed? : boolean;
  to_fixed?: boolean;
}

export interface IViewEvents {
  slideStart: IEvent;
  slideEnd: IEvent;
  fromChanged: IEvent;
  toChanged: IEvent;
}

export type Orient = 'horizontal' | 'vertical';
export type Types = 'single' | 'min' | 'max' | 'double';