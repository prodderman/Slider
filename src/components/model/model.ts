import IEvent from './../observer/observer';
import { IModel, IOptions, IEvents, Partial, IState } from './namespace';
import { initialOptions } from './initial';

class Model implements IModel {
  private modelEvents: IEvents = {
    stateChanged: new IEvent(),
  };

  private _options: IOptions = { ...initialOptions };
  private _state: IState = { from: initialOptions.from, to: initialOptions.to };

  get options(): IOptions { return { ...this._options }; }
  get state(): IState { return { ...this._state }; }
  get events(): IEvents { return { ...this.modelEvents }; }

  public updateOptions(options: IOptions) {
    this.setType(options.isDouble);
    this.setStep(options.step);
    this.setRange(options.min, options.max);
    this.setValues(options.from, options.to);
  }

  public updateState(nextState: Partial<IState>) {
    const opt = this.options;
    if (nextState.from !== void(0)) {
      const fromWithStep =  this.calcValueWithStep(nextState.from, opt.min, opt.step);
      const fromInDiapason = opt.isDouble
        ? this.correctDiapason(fromWithStep, opt.min, this._state.to)
        : this.correctDiapason(fromWithStep, opt.min, opt.max);

      if (fromInDiapason !== this._state.from) {
        this._state.from = fromInDiapason;
        this.modelEvents.stateChanged.notify({ handle: 'from', value: this._state.from });
      }
    }

    if (nextState.to !== void(0)) {
      const toWithStep = this.calcValueWithStep(nextState.to, opt.min, opt.step);
      const toInDiapason = opt.isDouble
        ? this.correctDiapason(toWithStep, this._state.from, opt.max)
        : this.correctDiapason(toWithStep, opt.min, opt.max);

      if (toInDiapason !== this._state.to) {
        this._state.to = toInDiapason;
        this.modelEvents.stateChanged.notify({ handle: 'to', value: this._state.to });
      }
    }
  }

  private setRange(min = this._options.min, max = this._options.max) {
    this._options.min = min > max ? max : min;
    this._options.max = max;
    this.correctFromTo();
  }

  private setValues(from = this._options.from, to = this._options.to) {
    this._options.from = from;
    this._options.to = to;
    this.correctFromTo();
  }

  private setStep(step: number) {
    const opt = this._options;
    const range = opt.max - opt.min;
    opt.step = this.correctStep(step, range);
  }

  private setType(type: boolean) {
    this._options.isDouble = type;
    this.correctFromTo();
  }

  private correctFromTo() {
    const opt = this._options;
    opt.from = this.correctDiapason(opt.from, opt.min, opt.max);
    opt.to = opt.isDouble ? this.correctDiapason(opt.to, opt.from, opt.max) : opt.to;
    this._state = { from: opt.from, to: opt.to };
  }

  private calcValueWithStep(value: number, offset: number, step: number) {
    return Math.round((value - offset) / step) * step + offset;
  }

  private correctDiapason(value: number, min: number, max: number): number {
    if (value <= min) { return min; }
    if (value >= max) { return max; }
    return value;
  }

  private correctStep(step: number, maxStep: number) {
    if (step <= 0) { return 1; }
    if (step > maxStep) { return maxStep; }
    return step;
  }
}

export default Model;
