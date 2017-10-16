import Event from './../observer/observer';
import { IModel, IModelOptions } from './namespace';

interface IMandatoryOptions {
  range: boolean;
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
}

export default class Model implements IModel {
  
  public events = {
    rangeChanged: new Event(),
    fromChanged: new Event(),
    toChanged: new Event(),
    stepChanged: new Event(),

  }

  private options: IMandatoryOptions  = {
    range: false,
    min: 0,
    max: 100,
    from: 0,
    to: 0,
    step: 1
  }

  public constructor(modelOptions: IModelOptions = {}) {
    this.validate(modelOptions);
  }

  // accessors

  get data() {
    return this.options;
  }

  // public methods

  public validate(options: IModelOptions, isUpadate: boolean = false) {

  }

  public calcFromWithStep(value: number) {
    
  }

  public calcToWithStep(value: number) {
    
  }

  // private methods

  private setMin(value: number) {

  }

  private setMax(value: number) {

  }

  private setFrom(value: number) {

  }

  private setTo(value: number) {

  }

  private setStep(value: number) {

  }

  private setRange(value: boolean) {

  }

  private inRange(value: number) {

  }
}