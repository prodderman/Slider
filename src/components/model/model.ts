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
    from_fixed: false,
    to: 0,
    to_fixed: false,
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

    if (options.type !== undefined) {
      this.setType(options.type);
    }

    if (options.step !== undefined) {
      this.setStep(options.step);
    }

    if (options.min !== undefined || options.max !== undefined) {
      this.setRange(options.min, options.max);
    }

    if (options.from_fixed !== undefined || options.to_fixed !== undefined) {
      this.setFixed(options.from_fixed, options.to_fixed);
    }

    if (options.from !== undefined || options.to !== undefined) {
      this.setValues(options.from, options.to);
    }
  }

  public calcFromWithStep(value: number) {
    const o = this.options;
    let result;

    if (o.from_fixed) {
      return;
    }

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
      this.triggers.fromChanged.notify(o.from);
    }
  }

  public calcToWithStep(value: number) {
    const o = this.options;
    let result;

    if (!o.type || o.to_fixed) {
      return;
    }

    result = this.inDaipason(value, o.from, o.max);
    
    if (result === value) {
      result = Math.round(( value - o.min ) / o.step) * o.step + o.min;
    }

    if (result != o.to) {
      o.to = result;
      this.triggers.toChanged.notify(o.to);
    }
  }

  // private methods

  private setRange(min = this.options.min, max = this.options.max) {
    const o = this.options;

    if (min > max) {
      max = min;
    }

    o.min = min;
    o.max = max;
    this.updateFromTo();
  }

  private setValues(from = this.options.from, to = this.options.to) {
    const o = this.options;
    o.from = from;
    o.to = to;
    this.updateFromTo();
  }

  private setStep(step: number) {
    const o = this.options;
    const range = o.max - o.min;
    if (step < 0) {
      o.step = 1;
    } else if (step > range) {
      o.step = range;
    } else {
      o.step = step;
    }
  }

  private setType(type: boolean) {
    const o = this.options;
    o.type = type;
    this.updateFromTo();
  }

  private setFixed(from = this.options.from_fixed, to= this.options.to_fixed) {
    const o = this.options;
    o.from_fixed = from;
    o.to_fixed = to;
  }

  private updateFromTo() {
    const o = this.options;
    o.from = this.inDaipason(o.from, o.min, o.max);

    if (o.type) {
      o.to = this.inDaipason(o.to, o.from, o.max)
    }
  }

  private inDaipason(value: number, min = this.options.min, max = this.options.min) {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    } else {
      return value;
    }
  }
}