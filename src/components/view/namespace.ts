import IEvent from './../observer/observer';

export interface IOptions {
  type: TSliderType;
  orientation: TOrientation;
  fromFixed: boolean;
  toFixed: boolean;
  [key: string]: any;
}

export interface INodes {
  track: HTMLDivElement;
  from: HTMLSpanElement;
  to: HTMLSpanElement;
  range: HTMLDivElement;
  [key: string]: HTMLDivElement | HTMLSpanElement;
}

export interface IEvents {
  slideStart: IEvent;
  slideEnd: IEvent;
  fromChanged: IEvent;
  toChanged: IEvent;
  [key: string]: IEvent;
}
export type TSliderType = 'single' | 'from-start' | 'from-end' | 'double';
export type TOrientation = 'vertical' | 'horizontal';
export type TRoot = HTMLDivElement | HTMLSpanElement;

export const initialOptions: IOptions = {
  type: 'single',
  orientation: 'horizontal',
  fromFixed: false,
  toFixed: false
};
