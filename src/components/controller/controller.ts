import { IModel } from './../model/namespace';
import { IView, TEvent, INodes, TOrientation } from '../view/namespace';
import { ICallbacks, TCallback, TCustomEvents, IClientData, IController } from './namespace';
import { initialOptions } from './initial';

class Controller implements IController {

  private callbacks: ICallbacks = { ...initialOptions };

  constructor(private model: IModel, private view: IView, callbacks: ICallbacks) {
    this.init(callbacks);
  }

  public updateClientsCallbacks(callbacks: ICallbacks) {
    this.setCallbacks(callbacks);
    this.emitEvent('vanillaupdate', 'root', this.callbacks.onUpdate, this.getModelViewData());
    this.view.changeHandlePosition('from', this.convertToPercent(this.model.state.from));
    this.view.changeHandlePosition('to', this.convertToPercent(this.model.state.to));
  }

  private init(callbacks: ICallbacks) {
    this.setCallbacks(callbacks);
    this.emitEvent('vanillacreate', 'root', this.callbacks.onCreate, this.getModelViewData());
    this.attachModelEvents();
    this.attachViewEvents();
    this.view.changeHandlePosition('from', this.convertToPercent(this.model.state.from));
    this.view.changeHandlePosition('to', this.convertToPercent(this.model.state.to));
  }

  private setCallbacks(callbacks: ICallbacks) {
    this.callbacks.onCreate = callbacks.onCreate;
    this.callbacks.onSlideStart = callbacks.onSlideStart;
    this.callbacks.onSlide = callbacks.onSlide;
    this.callbacks.onSlideFinish = callbacks.onSlideFinish;
    this.callbacks.onUpdate = callbacks.onUpdate;
  }

  private attachViewEvents() {
    const model = this.model;
    const view = this.view;

    view.events.slide.attach(() => {
      console.log();
    });

    view.events.slide.attach(({ handle, pixels }) => {
      model.updateState({[handle]: this.convertToSliderValue(pixels)});
    });

    view.events.slideStart.attach(({ handle }) => {
      this.emitEvent('vanillastart', handle, this.callbacks.onSlideStart, this.getModelViewData());
    });
    view.events.slideFinish.attach(({ handle }) => {
      this.emitEvent('vanillafinish', handle, this.callbacks.onSlideFinish, this.getModelViewData());
    });
  }

  private attachModelEvents() {
    const model = this.model;
    const view = this.view;

    model.events.stateChanged.attach(({ handle, value }) => {
      view.changeHandlePosition(handle, this.convertToPercent(value));
      this.emitEvent('vanillaslide', handle, this.callbacks.onSlide, this.getModelViewData());
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

  private emitEvent(eventName: TCustomEvents, eventSource: keyof INodes, clientCallback: TCallback | null, eventData: IClientData) {
    const customEvent = this.createSliderEvent(eventName, eventData);
    this.view.emitCustomEvent(customEvent, eventSource);
    this.callClientCallback(customEvent, eventData, clientCallback);
  }

  private callClientCallback(event: TEvent, data: IClientData, callback: TCallback | null) {
    if (callback) {
      callback(event, data);
    }
  }

  private createSliderEvent(eventName: TCustomEvents, data: IClientData) {
    return new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      cancelable: true,
    });
  }

  private getModelViewData(): IClientData {
    return {
      from: this.model.state.from,
      to: this.model.state.to,
    };
  }
}

export default Controller;
