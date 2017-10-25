import IEvent from './../observer/observer';
import { IModel, IModelOptions, IMandatoryOptions, IModelEvents } from './namespace';

export default class Model implements IModel {
  
  private triggers: IModelEvents = {
    fromChanged: new IEvent(),
    toChanged: new IEvent(),
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
    this.init(modelOptions);
  }

  // accessors

  get data(): IMandatoryOptions {
    return this.options;
  }

  get events(): IModelEvents {
    return this.triggers;
  }

  // public methods

  public init(options: IModelOptions = {}, isUpdate?: boolean) { 
    if (options.type) {
      this.setType(options.type);
    }

    if (options.step) {
      this.setStep(options.step);
    }

    if (options.min || options.max) {
      this.setRange(options.min, options.max);
    }

    if (options.from || options.to) {
      this.setValues(options.from, options.to);
    }
  }

  public calcFromWithStep(value: number) {
    const o = this.options;
    let result;

    if (o.type) {
      result = this.inDaipason(value, o.min, o.to);
    } else {
      result = this.inDaipason(value, o.min, o.max);
    }
    
    if (result === value) {
      result = Math.round(( value - o.min ) / o.step) * o.step + o.min;
    }

    if (result != o.from) {
      o.from = result;
      this.triggers.fromChanged.notify();
    }
  }

  public calcToWithStep(value: number) {
    const o = this.options;
    let result;

    if (!o.type) {
      return;
    }

    result = this.inDaipason(value, o.from, o.max);
    
    if (result === value) {
      result = Math.round(( value - o.min ) / o.step) * o.step + o.min;
    }

    if (result != o.to) {
      o.to = result;
      this.triggers.toChanged.notify();
    }
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
    o.from = this.inDaipason(o.from, o.min, o.max);

    if (o.type) {
      o.to = this.inDaipason(o.to, o.from, o.max)
    }
  }

  private inDaipason(value: number, min = this.options.min, max = this.options.min) {
    let result: number;
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    } else {
      return value;
    }
  }
}