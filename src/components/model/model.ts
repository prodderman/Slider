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
    let result;

    if (this.options.from_fixed) {
      return;
    }

    result = Math.round(( value - this.options.min ) / this.options.step) * this.options.step + this.options.min;
    if (this.options.type) {
      result = this.inDaipason(result, this.options.min, this.options.to);
    } else {
      result = this.inDaipason(result, this.options.min, this.options.max);
    }

    if (result != this.options.from) {
      this.options.from = result;
      this.triggers.fromChanged.notify(this.options.from);
    }
  }

  public calcToWithStep(value: number) {
    let result;

    if (!this.options.type || this.options.to_fixed) {
      return;
    }

    result = Math.round(( value - this.options.min ) / this.options.step) * this.options.step + this.options.min;
    result = this.inDaipason(result, this.options.from, this.options.max);

    if (result != this.options.to) {
      this.options.to = result;
      this.triggers.toChanged.notify(this.options.to);
    }
  }

  // private methods

  private setRange(min = this.options.min, max = this.options.max) {
     if (min > max) {
      max = min;
    }

    this.options.min = min;
    this.options.max = max;
    this.updateFromTo();
  }

  private setValues(from = this.options.from, to = this.options.to) {
    this.options.from = from;
    this.options.to = to;
    this.updateFromTo();
  }

  private setStep(step: number) {
    const range = this.options.max - this.options.min;
    if (step <= 0) {
      this.options.step = 1;
    } else if (step > range) {
      this.options.step = range;
    } else {
      this.options.step = step;
    }
  }

  private setType(type: boolean) {
    this.options.type = type;
    this.updateFromTo();
  }

  private setFixed(from = this.options.from_fixed, to = this.options.to_fixed) {
    this.options.from_fixed = from;
    this.options.to_fixed = to;
  }

  private updateFromTo() {
    this.options.from = this.inDaipason(this.options.from, this.options.min, this.options.max);

    if (this.options.type) {
      this.options.to = this.inDaipason(this.options.to, this.options.from, this.options.max)
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