import IEvent from './../observer/observer';
import { IModel, IOptions, IEvents, Partial, IState, THandleType } from './namespace';
import { initialOptions } from './initial';

class Model implements IModel {
  private _events: IEvents = {
    stateChanged: new IEvent(),
  };

  private _options: IOptions = { ...initialOptions };
  private _state: IState = { from: initialOptions.from, to: initialOptions.to };

  get options(): IOptions { return { ...this._options }; }
  get state(): IState { return { ...this._state }; }
  get events(): IEvents { return { ...this._events }; }

  public updateOptions(options: IOptions) {
    this.setType(options.isDouble);
    this.setStep(options.step);
    this.setRange(options.min, options.max);
    this.setHandleValues(options.from, options.to);
  }

  public updateState(nextState: Partial<IState>) {
    const opt = this._options;
    if (nextState.from !== void(0)) {
      this.updateFromHandleValue(opt, nextState.from);
    }

    if (nextState.to !== void(0)) {
      this.updateToHandleValue(opt, nextState.to);
    }
  }

  private updateFromHandleValue(options: IOptions, fromValue: number) {
    const fromWithStep =  this.calcValueWithStep(fromValue, options.min, options.step);
    const fromInDiapason = options.isDouble
      ? this.correctDiapason(fromWithStep, options.min, this._state.to)
      : this.correctDiapason(fromWithStep, options.min, options.max);

    if (fromInDiapason !== this._state.from) {
      this.updateStateHandleValue('from', fromInDiapason);
    }
  }

  private updateToHandleValue(options: IOptions, toValue: number) {
    const toWithStep = this.calcValueWithStep(toValue, options.min, options.step);
    const toInDiapason = options.isDouble
      ? this.correctDiapason(toWithStep, this._state.from, options.max)
      : this.correctDiapason(toWithStep, options.min, options.max);

    if (toInDiapason !== this._state.to) {
      this.updateStateHandleValue('to', toInDiapason);
    }
  }

  private updateStateHandleValue(handle: THandleType, newValue: number) {
    this._state[handle] = newValue;
    this._events.stateChanged.notify({ handle, value: newValue });
  }

  private setRange(min = this._options.min, max = this._options.max) {
    this._options.min = min > max ? max : min;
    this._options.max = max;
    this.correctFromTo();
  }

  private setHandleValues(from = this._options.from, to = this._options.to) {
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
