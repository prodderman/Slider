import IEvent from './../observer/observer';
import { IModel, IOptions, IEvents } from './namespace';
import { initialOptions } from './initial';
import { bind } from 'decko';

class Model implements IModel {
  private modelEvents: IEvents = {
    fromChanged: new IEvent(),
    toChanged: new IEvent(),
  };

  private options: IOptions = {...initialOptions};

  get data(): IOptions {
    return this.options;
  }

  get events(): IEvents {
    return this.modelEvents;
  }

  @bind
  public update(options: IOptions) {
    this.setType(options.type);
    this.setStep(options.step);
    this.setRange(options.min, options.max);
    this.setFixed(options.fromFixed, options.toFixed);
    this.setValues(options.from, options.to);
  }

  @bind
  public calcFromWithStep(realValue: number) {
    const opt = this.options;
    if (opt.fromFixed) { return; }

    const valueWithStep = Math.round(( realValue - opt.min ) / opt.step);
    const valueOffset = valueWithStep * opt.step + opt.min;
    const valueInDiapason = opt.type ? this.correctDiapason(valueOffset, opt.min, opt.to) : this.correctDiapason(valueOffset, opt.min, opt.max);

    if (valueInDiapason !== opt.from) {
      opt.from = valueInDiapason;
      this.modelEvents.fromChanged.notify(opt.from);
    }
  }

  @bind
  public calcToWithStep(realValue: number) {
    const opt = this.options;
    if (!opt.type || opt.toFixed) { return; }

    const valueWithStep = Math.round(( realValue - opt.min ) / opt.step);
    const valueOffset = valueWithStep  * opt.step + opt.min;
    const valueInDiapason = this.correctDiapason(valueOffset, opt.from, opt.max);

    if (valueInDiapason !== opt.to) {
      opt.to = valueInDiapason;
      this.modelEvents.toChanged.notify(opt.to);
    }
  }

  private setRange(min = this.options.min, max = this.options.max) {
    this.options.min = min > max ? max : min;
    this.options.max = max;
    this.updateFromTo();
  }

  private setValues(from = this.options.from, to = this.options.to) {
    this.options.from = from;
    this.options.to = to;
    this.updateFromTo();
  }

  private setStep(step: number) {
    const opt = this.options;
    const range = opt.max - opt.min;
    if (step <= 0) {
      opt.step = 1;
      return;
    }

    if (step > range) {
      opt.step = range;
      return;
    }
    opt.step = step;
  }

  private setType(type: boolean) {
    this.options.type = type;
    this.updateFromTo();
  }

  private setFixed(from = this.options.fromFixed, to = this.options.toFixed) {
    this.options.fromFixed = from;
    this.options.toFixed = to;
  }

  private updateFromTo() {
    const opt = this.options;
    opt.from = this.correctDiapason(opt.from, opt.min, opt.max);
    opt.to = opt.type ? this.correctDiapason(opt.to, opt.from, opt.max) : opt.to;
  }

  private correctDiapason(value: number, min: number, max: number): number {
    if (value <= min) { return min; }
    if (value >= max) { return max; }
    return value;
  }
}

export default Model;
