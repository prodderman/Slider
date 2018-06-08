import { IModel } from './../model/namespace';
import { IView, TEvent, INodes, TOrientation } from '../view/namespace';
import { ICallbacks, TCallback, TCustomEvents, IModelViewData, IController } from './namespace';
import { initialOptions } from './initial';

class Controller implements IController {

  private callbacks: ICallbacks = { ...initialOptions };

  constructor(private model: IModel, private view: IView, callbacks: ICallbacks) {
    this.init(callbacks);
  }

  public updateClientsCallbacks(callbacks: ICallbacks) {
    this.setCallbacks(callbacks);
    this.emitEvent('vanillaupdate', 'root', this.callbacks.onUpdate, this.getModelViewData());
    this.view.changeHandlePosition('from', this.convertToPercent(this.model.data.from));
    this.view.changeHandlePosition('to', this.convertToPercent(this.model.data.to));
  }

  private init(callbacks: ICallbacks) {
    this.setCallbacks(callbacks);
    this.emitEvent('vanillacreate', 'root', this.callbacks.onCreate, this.getModelViewData());
    this.attachModelEvents();
    this.attachViewEvents();
    this.view.changeHandlePosition('from', this.convertToPercent(this.model.data.from));
    this.view.changeHandlePosition('to', this.convertToPercent(this.model.data.to));
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

    view.events.slide.attach(({ handle, coords }) => {
      model.updateHandleValue(handle, this.convertToReal(coords));
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

  private convertToPercent(realValue: number): number {
    const modelData = this.model.data;
    const range = modelData.max - modelData.min;
    return Number(((realValue - modelData.min) * 100 / range).toFixed(10));
  }

  private convertToReal(pixels: number): number {
    const modelData = this.model.data;
    const sliderSize = this.view.sliderSize;
    const range = modelData.max - modelData.min;
    return this.view.data.orientation === TOrientation.horizontal ?
      Number((pixels * range / sliderSize.width + modelData.min).toFixed(10)) :
      Number(((sliderSize.height - pixels) * range / sliderSize.height + modelData.min).toFixed(10));
  }

  // tslint:disable-next-line:max-line-length
  private emitEvent(eventName: TCustomEvents, eventSrc: keyof INodes, clientCallback: TCallback | null, eventData: IModelViewData) {
    const customEvent = this.createSliderEvent(eventName, eventData);
    this.view.emitCustomEvent(customEvent, eventSrc);
    this.callClientCallback(customEvent, eventData, clientCallback);
  }

  private callClientCallback(event: TEvent, data: IModelViewData, callback: TCallback | null) {
    if (callback) {
      callback(event, data);
    }
  }

  private createSliderEvent(eventName: TCustomEvents, data: IModelViewData) {
    return new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      cancelable: true,
    });
  }

  private getModelViewData() {
    return { ...this.model.data, ...this.view.data };
  }
}

export default Controller;
