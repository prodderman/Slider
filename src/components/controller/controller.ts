import IEvent from './../observer/observer';
import Model from './../model/model';
import View from './../view/view';

import { IEvents as IViewEvents } from '../view/namespace';
import { IEvents as IModelEvents } from '../model/namespace';
import { ICallbacks, CustomEvents, event, TCallback, initialOptions } from './namespace';

export default class Controller {

  private callbacks: ICallbacks = {...initialOptions};
  private customEvents: CustomEvents = {};

  constructor(private model: Model, private view: View, callbacks: ICallbacks) {
    this.init(callbacks);
  }

  public init(callbacks: ICallbacks): void {
    this.setCallbacks(callbacks);
    this.customEvents.create =  this.createSliderEvent('vanillacreate');
    this.callClientCallback(this.customEvents.create, { ...this.model.data, ...this.view.data }, this.callbacks.onCreate);
    this.view.rootObject.dispatchEvent(this.customEvents.create);
    this.attachModelEvents();
    this.attachViewEvents();
    this.view.calcFrom(this.convertToPercent(this.model.data.from));
    this.view.calcTo(this.convertToPercent(this.model.data.to));
  }

  public update(callback: ICallbacks) {
    this.setCallbacks(callback);
    this.customEvents.update = this.createSliderEvent('vanillaupdate');
    this.callClientCallback(this.customEvents.update, { ...this.model.data, ...this.view.data }, this.callbacks.onUpdate);
    this.view.rootObject.dispatchEvent(this.customEvents.update);
    this.view.calcFrom(this.convertToPercent(this.model.data.from));
    this.view.calcTo(this.convertToPercent(this.model.data.to));
  }

  private setCallbacks(callbacks: ICallbacks) {
    this.callbacks.onCreate = callbacks.onCreate;
    this.callbacks.onStart = callbacks.onStart;
    this.callbacks.onSlide = callbacks.onSlide;
    this.callbacks.onEnd = callbacks.onEnd;
    this.callbacks.onUpdate = callbacks.onUpdate;
  }

  private attachViewEvents() {
    const model = this.model;
    const view = this.view;

    view.events.fromChanged.attach((realValue: number) => {
      model.calcFromWithStep(this.convertToReal(realValue));
    });

    view.events.toChanged.attach((realValue: number) => {
      model.calcToWithStep(this.convertToReal(realValue));
    });

    view.events.slideStart.attach((handle: HTMLSpanElement) => {
      this.customEvents.start = this.createSliderEvent('vanillastart');
      this.callClientCallback(this.customEvents.start, { handle: handle, ...model.data, ...view.data}, this.callbacks.onStart);
      handle.dispatchEvent(this.customEvents.start);
    });

    view.events.slideEnd.attach((handle: HTMLSpanElement) => {
      this.customEvents.end = this.createSliderEvent('vanillaend');
      this.callClientCallback(this.customEvents.end, { handle: handle, ...model.data, ...view.data }, this.callbacks.onEnd);
      handle.dispatchEvent(this.customEvents.end);
    });
  }

  private attachModelEvents() {
    const model = this.model;
    const view = this.view;

    model.events.fromChanged.attach((fromValue: number) => {
      view.calcFrom(this.convertToPercent(fromValue));
      this.customEvents.slide = this.createSliderEvent('vanillaslide');
      this.callClientCallback(this.customEvents.slide, { handle: view.nodesData.from, ...model.data, ...view.data }, this.callbacks.onSlide);
      view.nodesData.from.dispatchEvent(this.customEvents.slide);
    });

    model.events.toChanged.attach((toValue: number) => {
      view.calcTo(this.convertToPercent(toValue));
      this.customEvents.slide = this.createSliderEvent('vanillaslide');
      this.callClientCallback(this.customEvents.slide, { handle: view.nodesData.to, ...model.data, ...view.data }, this.callbacks.onSlide);
      (view.nodesData.to).dispatchEvent(this.customEvents.slide);
    });
  }

  private convertToPercent(realValue: number): number {
    const modelData = this.model.data;
    const range = modelData.max - modelData.min;
    return Number( ((realValue - modelData.min) * 100 / range).toFixed(10) );
  }

  private convertToReal(pixels: number): number {
    const modelData = this.model.data;
    const viewNodes = this.view.nodesData;
    const range = modelData.max - modelData.min;
    return this.view.data.orientation === 'horizontal' ?
      Number((pixels * range / viewNodes.track.clientWidth + modelData.min).toFixed(10)) :
      Number(((viewNodes.track.clientHeight - pixels) * range / viewNodes.track.clientHeight + modelData.min).toFixed(10));
  }

  private callClientCallback(event: event, data = {}, callback: TCallback | null): void {
    if (callback) {
      callback(event, data);
    }
  }

  private createSliderEvent(eventName: string) {
    return new CustomEvent(eventName, {
      detail: {
        from: this.model.data.from,
        to: this.model.data.to,
      },
      bubbles: true,
      cancelable: true
    });
  }
}