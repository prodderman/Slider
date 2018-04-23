import IEvent from './../observer/observer';

export interface IViewOptions {
  type?: TType;
  orientation?: TOrientation;
  fromFixed?: boolean;
  toFixed?: boolean;
}

export interface IViewEvents {
  slideStart: IEvent;
  slideEnd: IEvent;
  fromChanged: IEvent;
  toChanged: IEvent;
}

export type TType = 'single' | 'min' | 'max' | 'double';
export type TOrientation = 'vertical' | 'horizontal';