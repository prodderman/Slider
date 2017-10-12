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
    this.init(options);
    console.log(options);
    console.log(this.options);
  }

  // accessors

  get range() {
    return this.options.range;
  }

  set range(newValue: boolean) {
    this.options.range = newValue;
    this.setValues([this.min, this.max]);
  }

  get value() {
      return <number>this.options.values[1];
  }

  set value(newValue: number) {
    if (this.range) {
      if (newValue < this.min) {
        this.options.values[1] = this.min;
      } else if (newValue > this.max) {
        this.options.values[1] = this.max;
      } else  {
        this.options.values[1] = newValue;
      }
    }
  }

  get values() {
    return this.options.values;
  }

  set values(newValue: [number, number]) {
    
  }

  get max() {
    return <number>this.options.segment[1];
  }

  set max(newValue: number) {
    if (newValue < this.options.segment[0]) {
      this.options.segment[0] = this.options.segment[1] = newValue;
    } else  {
      this.options.segment[1] = newValue;
    }    
    if (newValue < this.options.values[1]) {
      this.values = [this.options.values[0], newValue];
    }
  }

  get min() {
    return <number>this.options.segment[0];
  }

  set min(newValue: number) {
    this.options.segment[0] = newValue;
  }

  get segment() {
    return this.options.segment;
  }

  set segment(newValue: [number, number]) {
    this.options.segment = newValue;
  }
  

  // public methods

  // private methods

  private init(options: IOptions) {
    if (options.range) {
      this.range = options.range
    }
    if (options.max) {
      this.max = options.max;
    }
    if (options.min) {
      this.min = options.min;
    } 
    if (options.value) {
      this.value = options.value
    } else {
      this.value = this.options.values[1];
    }
    if (options.values) {
      this.values = options.values
    } else {
      this.values = this.options.values;
    }
  }

  private setValues(vals: [number, number]) {
    this.options.values = vals;
  }
}