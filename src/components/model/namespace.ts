import Event from './../observer/observer';

export interface IModel {

}

export interface IModelOptions {
  type?: boolean;
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number;
}