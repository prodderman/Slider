import IEvent from './../observer/observer';

export interface IViewOptions {
  type?: SliderTypes;
  orientation?: Orient;
  fromFixed?: boolean;
  toFixed?: boolean;
}

export interface IViewEvents {
  slideStart: IEvent;
  slideEnd: IEvent;
  fromChanged: IEvent;
  toChanged: IEvent;
}

export type Orient = 'horizontal' | 'vertical';
export type SliderTypes = 'single' | 'min' | 'max' | 'double';