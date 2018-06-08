import IEvent from './../observer/observer';
import { IModel, IOptions, IEvents } from './namespace';
import { initialOptions } from './initial';
import { THandle } from '../view/namespace';

class Model implements IModel {
  private modelEvents: IEvents = {
    stateChanged: new IEvent(),
  };

  private options: IOptions = {...initialOptions};

  get data(): IOptions { return { ...this.options }; }
  get events(): IEvents { return { ...this.modelEvents }; }

  public updateState(options: IOptions) {
    this.setType(options.type);
    this.setStep(options.step);
    this.setRange(options.min, options.max);
    this.setFixed(options.fromFixed, options.toFixed);
    this.setValues(options.from, options.to);
  }

  public updateHandleValue(handle: THandle, rawHandleValue: number) {
    const opt = this.options;
    const valueFixed = handle === 'from' ? opt.fromFixed : opt.toFixed;
    if (valueFixed) { return; }
    const minLimitForHandle = handle === 'from' ? opt.min : opt.from;
    const maxLimitForHandle = handle === 'from' ? opt.to : opt.max;

    const valueWithStep = Math.round((rawHandleValue - opt.min) / opt.step);
    const valueOffset = valueWithStep * opt.step + opt.min;
    const valueInDiapason = opt.type ?
      this.correctDiapason(valueOffset, minLimitForHandle, maxLimitForHandle) :
      this.correctDiapason(valueOffset, minLimitForHandle, opt.max);

    if (valueInDiapason !== opt[handle]) {
      opt[handle] = valueInDiapason;
      this.modelEvents.stateChanged.notify({ handle, value: opt[handle]});
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
