import Event from './../observer/observer';

export interface IModel {

}

export interface IMOptions {
  range? : boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  values?: [number, number];
  step? : number;
}