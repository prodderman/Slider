import Event from './../observer/observer';

export interface IModel {

}

export interface IOptions {
  range?: boolean;
  min?: number;
  max?: number;
  value?: number;
  valueAlt?: number;
  values?: [number, number];
}