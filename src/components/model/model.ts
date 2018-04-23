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

    if (!this.isUndefined(options.type)) {
      this.setType(options.type as boolean);
    }

    if (!this.isUndefined(options.step)) {
      this.setStep(options.step as number);
    }

    if (!this.isUndefined(options.min) || !this.isUndefined(options.max)) {
      this.setRange(options.min, options.max);
    }

    if (!this.isUndefined(options.fromFixed) || !this.isUndefined(options.toFixed)) {
      this.setFixed(options.fromFixed, options.toFixed);
    }

    if (!this.isUndefined(options.from) || !this.isUndefined(options.to)) {
      this.setValues(options.from, options.to);
    }
  }

  public calcFromWithStep(realValue: number): void {
    const opt = this.options;
    if (opt.fromFixed) {
      return;
    }

    const valueWithStep = Math.round(( realValue - opt.min ) / opt.step);
    const valueOffset = valueWithStep * opt.step + opt.min;

    let valueInDiapason;
    if (opt.type) {
      valueInDiapason = this.correctDiapason(valueOffset, opt.min, opt.to);
    } else {
      valueInDiapason = this.correctDiapason(valueOffset, opt.min, opt.max);
    }

    if (valueInDiapason !== opt.from) {
      opt.from = valueInDiapason;
      this.triggers.fromChanged.notify(opt.from);
    }
  }

  public calcToWithStep(realValue: number): void {
    const opt = this.options;
    if (!opt.type || opt.toFixed) {
      return;
    }

    const valueWithStep = Math.round(( realValue - opt.min ) / opt.step);
    const valueOffset = valueWithStep  * opt.step + opt.min;
    const valueInDiapason = this.correctDiapason(valueOffset, opt.from, opt.max);

    if (valueInDiapason !== opt.to) {
      opt.to = valueInDiapason;
      this.triggers.toChanged.notify(opt.to);
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
    const opt = this.options;
    const range = opt.max - opt.min;
    if (step <= 0) {
      opt.step = 1;
    } else if (step > range) {
      opt.step = range;
    } else {
      opt.step = step;
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
    const opt = this.options;
    opt.from = this.correctDiapason(opt.from, opt.min, opt.max);

    if (opt.type) {
      opt.to = this.correctDiapason(opt.to, opt.from, opt.max);
    }
  }

  private correctDiapason(value: number, min = this.options.min, max = this.options.min): number {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    } else {
      return value;
    }
  }

  private isUndefined(value: any): boolean {
    return value === undefined;
  }
}