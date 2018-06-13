import { IModel } from './../model/namespace';
import { IView, TEvent, INodes, TOrientation } from '../view/namespace';
import { ICallbacks, TCallback, TCustomEvents, IController } from './namespace';
import { initialOptions } from './initial';

class Controller implements IController {

  private callbacks: ICallbacks = { ...initialOptions };

  constructor(private model: IModel, private view: IView, callbacks: ICallbacks) {
    this.init(callbacks);
  }

  public updateClientsCallbacks(callbacks: ICallbacks) {
    this.setCallbacks(callbacks);
    this.emitEvent('vanillaupdate', 'root', this.callbacks.onUpdate);
    this.updateViewHandlesPosition();
  }

  private init(callbacks: ICallbacks) {
    this.setCallbacks(callbacks);
    this.emitEvent('vanillacreate', 'root', this.callbacks.onCreate);
    this.attachModelEvents();
    this.attachViewEvents();
    this.updateViewHandlesPosition();
  }

  private setCallbacks(callbacks: ICallbacks) {
    this.callbacks.onCreate = callbacks.onCreate;
    this.callbacks.onSlideStart = callbacks.onSlideStart;
    this.callbacks.onSlide = callbacks.onSlide;
    this.callbacks.onSlideFinish = callbacks.onSlideFinish;
    this.callbacks.onUpdate = callbacks.onUpdate;
  }

  private attachViewEvents(): void {
    const model = this.model;
    const view = this.view;

    view.events.slide.attach(({ handle, pixels }) => {
      model.updateState({ [handle]: this.convertToSliderValue(pixels) });
    });

    view.events.slideStart.attach(({ handle }) => {
      this.emitEvent('vanillastart', handle, this.callbacks.onSlideStart);
    });

    view.events.slideFinish.attach(({ handle }) => {
      this.emitEvent('vanillafinish', handle, this.callbacks.onSlideFinish);
    });
  }

  private attachModelEvents(): void {
    const model = this.model;
    const view = this.view;

    model.events.stateChanged.attach(({ handle, value }) => {
      view.changeHandlePosition(handle, this.convertToPercent(value));
      this.emitEvent('vanillaslide', handle, this.callbacks.onSlide);
    });
  }

  private convertToPercent(sliderValue: number): number {
    const modelData = this.model.options;
    const range = modelData.max - modelData.min;
    return Number(((sliderValue - modelData.min) * 100 / range).toFixed(10));
  }

  private convertToSliderValue(pixels: number): number {
    const modelData = this.model.options;
    const sliderSize = this.view.sliderSize;
    const range = modelData.max - modelData.min;
    return this.view.options.orientation === TOrientation.horizontal ?
      Number((pixels * range / sliderSize.width + modelData.min).toFixed(10)) :
      Number(((sliderSize.height - pixels) * range / sliderSize.height + modelData.min).toFixed(10));
  }

  private emitEvent(eventName: TCustomEvents, eventSource: keyof INodes, clientCallback: TCallback | null): void {
    const customEvent = this.createSliderEvent(eventName);
    this.view.emitCustomEvent(customEvent, eventSource);
    this.callClientCallback(customEvent, clientCallback);
  }

  private updateViewHandlesPosition() {
    this.view.changeHandlePosition('from', this.convertToPercent(this.model.state.from));
    this.view.changeHandlePosition('to', this.convertToPercent(this.model.state.to));
  }

  private callClientCallback(event: TEvent, callback: TCallback | null): void {
    if (callback) {
      callback(event, { ...this.model.state });
    }
  }

  private createSliderEvent(eventName: TCustomEvents): CustomEvent {
    return new CustomEvent(eventName, {
      detail: { ...this.model.state },
      bubbles: true,
      cancelable: true,
    });
  }
}

export default Controller;
