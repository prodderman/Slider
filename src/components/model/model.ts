import IEvent from './../observer/observer';
import { IModel, IModelOptions, IMandatoryOptions, IModelEvents } from './namespace';

export default class Model implements IModel {
  private triggers: IModelEvents = {
    fromChanged: new IEvent(),
    toChanged: new IEvent(),
  };

  private options: IMandatoryOptions  = {
    type: false,
    min: 0,
    max: 100,
    from: 0,
    fromFixed: false,
    to: 0,
    toFixed: false,
    step: 1
  };

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

  public init(options: IModelOptions = {}): void {

    if (options.type !== undefined) {
      this.setType(options.type);
    }

    if (options.step !== undefined) {
      this.setStep(options.step);
    }

    if (options.min !== undefined || options.max !== undefined) {
      this.setRange(options.min, options.max);
    }

    if (options.fromFixed !== undefined || options.toFixed !== undefined) {
      this.setFixed(options.fromFixed, options.toFixed);
    }

    if (options.from !== undefined || options.to !== undefined) {
      this.setValues(options.from, options.to);
    }
  }

  public calcFromWithStep(realValue: number): void {
    if (this.options.fromFixed) {
      return;
    }

    const valueWithStep = Math.round(( realValue - this.options.min ) / this.options.step) * this.options.step + this.options.min;

    let valueInDiapason;
    if (this.options.type) {
      valueInDiapason = this.inDaipason(valueWithStep, this.options.min, this.options.to);
    } else {
      valueInDiapason = this.inDaipason(valueWithStep, this.options.min, this.options.max);
    }

    if (valueInDiapason !== this.options.from) {
      this.options.from = valueInDiapason;
      this.triggers.fromChanged.notify(this.options.from);
    }
  }

  public calcToWithStep(realValue: number): void {
    if (!this.options.type || this.options.toFixed) {
      return;
    }

    const valueWithStep = Math.round(( realValue - this.options.min ) / this.options.step) * this.options.step + this.options.min;
    const valueInDeiapason = this.inDaipason(valueWithStep, this.options.from, this.options.max);

    if (valueInDeiapason !== this.options.to) {
      this.options.to = valueInDeiapason;
      this.triggers.toChanged.notify(this.options.to);
    }
  }

  // private methods

  private setRange(min = this.options.min, max = this.options.max): void {
     if (min > max) {
      max = min;
    }

    this.options.min = min;
    this.options.max = max;
    this.updateFromTo();
  }

  private setValues(from = this.options.from, to = this.options.to): void {
    this.options.from = from;
    this.options.to = to;
    this.updateFromTo();
  }

  private setStep(step: number): void {
    const range = this.options.max - this.options.min;
    if (step <= 0) {
      this.options.step = 1;
    } else if (step > range) {
      this.options.step = range;
    } else {
      this.options.step = step;
    }
  }

  private setType(type: boolean): void {
    this.options.type = type;
    this.updateFromTo();
  }

  private setFixed(from = this.options.fromFixed, to = this.options.toFixed): void {
    this.options.fromFixed = from;
    this.options.toFixed = to;
  }

  private updateFromTo(): void {
    this.options.from = this.inDaipason(this.options.from, this.options.min, this.options.max);

    if (this.options.type) {
      this.options.to = this.inDaipason(this.options.to, this.options.from, this.options.max);
    }
  }

  private inDaipason(value: number, min = this.options.min, max = this.options.min): number {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    } else {
      return value;
    }
  }
}