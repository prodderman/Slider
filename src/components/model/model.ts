import Event from './../observer/observer';
import { IModel, IOptions } from './namespace';

interface IMandatoryOptions {
  range: boolean;
  segment: [number, number];  
  values: [number, number];
}

export default class Model implements IModel {
  
  public events = {
    rangeChanged: new Event(),
    maxChanged: new Event(),
    minChanged: new Event(),
    disabledChanged: new Event(),
    valuesChanged: new Event(),
    stepChangerd: new Event()
  }

  private options: IMandatoryOptions = {
    range: false,
    segment: [0,100],
    values: [0, 0],
  }

  public constructor(options: IOptions = {}) {
    
  }

  // accessors

  get range() {
    return false;
  }

  set range(newValue: boolean) {
    return
  }

  get value() {
    return this.options.values[0];
  }

  set value(newValue: number) {
    return
  }

  get valueAlt() {
    return this.options.values[1];
  }

  set valueAlt(newValue: number) {
    return
  }

  get values() {
    return this.options.values;
  }

  set values(newValue: [number, number]) {
    return
  }

  get max() {
    return <number>this.options.segment[1];
  }

  set max(newValue: number) {
    return
  }

  get min() {
    return <number>this.options.segment[0];
  }

  set min(newValue: number) {
    return
  }

  // public methods

  // private methods

  private init(options: IOptions) {

  }
}