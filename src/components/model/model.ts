import Event from './../observer/observer';
import { IModel, IMOptions } from './namespace';

export default class Model implements IModel {
  
  private events = {
    rangeChanged: new Event(),
    maxChanged: new Event(),
    minChanged: new Event(),
    disabledChanged: new Event(),
    valuesChanged: new Event()
  }

  private options: IMOptions = {
    range: false,
    min: 0,
    max: 100,
    disabled: false,
    values: [0, 0],
    step: 1
  }

  public constructor(options: IMOptions = {}) {
    
  }

  // accessors

  get values() {
    return <[number, number]>this.options.values;
  }

  set values(newValues: [number, number]) {

  }

  get max() {
    return <number>this.options.max;
  }

  set max(newValue: number) {

  }

  get min() {
    return <number>this.options.min;
  }

  set min(newValue: number) {
    
  }

  get range() {
    return <boolean>this.options.range;
  }

  set range(newValue: boolean) {

  }

  // public methods

  // private methods

  private init() {

  }
}