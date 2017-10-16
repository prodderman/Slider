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
    const o = this.options;
    if (o.min === min && o.max === max) {
      return false;
    } 

    if (min > max) {
      max = min;
    }

    o.min = min;
    o.max = max;
    this.updateFromTo();
    return true;
  }

  private setValues(from = this.options.from, to = this.options.to): boolean {
    const o = this.options;
    if (o.from === from && o.to === to) {
      return false;
    }
    o.from = from;
    o.to = to;
    this.updateFromTo();
    return true;
  }

  private setStep(value: number): boolean {
    const o = this.options;
    if (o.step === value) {
      return false;
    } else {
      let range;
      if (value < 0) {
        o.step = 1;
      } else if (value > (range = o.max - o.min)) {
        o.step = range;
      } else {
        o.step = value;
      }
      return true;
    }
  }

  private setType(value: boolean): boolean {
    const o = this.options;
    if (o.type === value) {
      return false;
    } else {
      o.type = value;
      return true;
    }
  }

  private updateFromTo() {
    const o = this.options;
    if (o.from < o.min) o.from = o.min;
    if (o.from > o.max) o.from = o.max;

    if (o.type) {
      if (o.to < o.from) o.to = o.from;
      if (o.to > o.max) o.to = o.max;
    }
  }
}