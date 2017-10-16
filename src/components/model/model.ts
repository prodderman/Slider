import Event from './../observer/observer';
import { IModel, IModelOptions } from './namespace';

interface IMandatoryOptions {
  type: boolean;
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
}

export default class Model implements IModel {
  
  private events = {
    fromChanged: new Event(),
    toChanged: new Event(),
    sliderChanged: new Event()
  }

  private options: IMandatoryOptions  = {
    type: false,
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

  get sliderChanged() {
    return this.events.sliderChanged;
  }

  get data() {
    return this.options;
  }

  get min() {
    return this.options.min;
  }

  get max() {
    return this.options.max;
  }

  get from() {
    return this.options.from;
  }

  get to() {
    return this.options.to;
  }

  // public methods

  public validate(options: IModelOptions = {}, isUpadate = false) {
    let changed = false;
    if (options.type) {
      changed = this.setType(options.type) || changed;
    }

    if (options.step) {
      changed = this.setStep(options.step) || changed;
    }

    if (options.min || options.max) {
      changed = this.setRange(options.min, options.max) || changed;
    }

    if (options.from || options.to) {
      changed = this.setValues(options.from, options.to) || changed;
    }

    if (changed && isUpadate) {
      this.events.sliderChanged.notify();
    }
  }

  public calcFromWithStep(value: number) {
    
  }

  public calcToWithStep(value: number) {
    
  }

  // private methods

  private setRange(min = this.options.min, max = this.options.max): boolean {
    if (this.options.min === min && this.options.max === max) {
      return false;
    } 

    if (min > max) {
      max = min;
    }

    this.options.min = min;
    this.options.max = max;
    this.updateFromTo();
    return true;
  }

  private setValues(from = this.options.from, to = this.options.to): boolean {
    if (this.options.from === from && this.options.to === to) {
      return false;
    }
    this.options.from = from;
    this.options.to = to;
    this.updateFromTo();
    return true;
  }

  private setStep(value: number): boolean {
    if (this.options.step === value) {
      return false;
    } else {
      let range;
      if (value > (range = this.options.max - this.options.min)) {
        this.options.step = range;
      } else {
        this.options.step = value;
      }
      return true;
    }
  }

  private setType(value: boolean): boolean {
    if (this.options.type === value) {
      return false;
    } else {
      this.options.type = value;
      return true;
    }
  }

  private updateFromTo() {
    if (this.options.from < this.options.min) {
      this.options.from = this.options.min;
    } 
    else if (this.options.from > this.options.max) {
      this.options.from = this.options.max;
    }

    if (this.options.type) {
      if (this.options.to < this.options.from) {
        this.options.to = this.options.from;
      } 
      else if (this.options.to > this.options.max) {
        this.options.to = this.options.max;
      }
    }
  }
}