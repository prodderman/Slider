import IEvent from './../observer/observer';
import Model from './../model/model';
import View from './../view/view';

import { IEvents as IViewEvents, IHandle, TRoot } from '../view/namespace';
import { IEvents as IModelEvents } from '../model/namespace';
import { ICallbacks, CustomEvents, event, TCallback, IModelViewData, initialOptions, initialCustomEvents } from './namespace';
import { bind } from 'decko';

export default class Controller {

  private callbacks: ICallbacks = {...initialOptions};
  private customEvents: CustomEvents = { ...initialCustomEvents };

  constructor(private model: Model, private view: View, callbacks: ICallbacks) {
    this.init(callbacks);
  }

  public init(callbacks: ICallbacks): void {
    this.setCallbacks(callbacks);
    this.emitEvent(this.customEvents.create, 'vanillacreate', this.view.rootObject, this.callbacks.onCreate, this.getModelViewData());
    this.attachModelEvents();
    this.attachViewEvents();
    this.view.calcFrom(this.convertToPercent(this.model.data.from));
    this.view.calcTo(this.convertToPercent(this.model.data.to));
  }

  public update(callback: ICallbacks) {
    this.setCallbacks(callback);
    this.emitEvent(this.customEvents.update, 'vanillaupdate', this.view.rootObject, this.callbacks.onUpdate, this.getModelViewData());
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

    view.events.slideStart.attach((handle: IHandle) => {
      this.emitEvent(this.customEvents.start, 'vanillastart', handle, this.callbacks.onStart, this.getModelViewData());
    });
    view.events.slideEnd.attach((handle: IHandle) => {
      this.emitEvent(this.customEvents.end, 'vanillaend', handle, this.callbacks.onEnd, this.getModelViewData());
    });
  }

  private attachModelEvents() {
    const model = this.model;
    const view = this.view;

    model.events.fromChanged.attach((fromValue: number) => {
      view.calcFrom(this.convertToPercent(fromValue));
      this.emitEvent(this.customEvents.slide, 'vanillaslide', view.nodesData.from, this.callbacks.onSlide, this.getModelViewData());
    });

    model.events.toChanged.attach((toValue: number) => {
      view.calcTo(this.convertToPercent(toValue));
      this.emitEvent(this.customEvents.slide, 'vanillaslide', view.nodesData.to, this.callbacks.onSlide, this.getModelViewData());
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

  private emitEvent(customEvent: event, eventName: string, eventSrc: TRoot, clientCallback: TCallback | null, eventData: IModelViewData) {
    customEvent = this.createSliderEvent(eventName, eventData);
    this.callClientCallback(customEvent, { ...this.model.data, ...this.view.data}, clientCallback);
    eventSrc.dispatchEvent(customEvent);
  }

  private callClientCallback(event: event, data: IModelViewData, callback: TCallback | null): void {
    if (callback) {
      callback(event, data);
    }
  }

  private createSliderEvent(eventName: string, data: IModelViewData) {
    return new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      cancelable: true
    });
  }

  private getModelViewData() {
    return { ...this.model.data, ...this.view.data };
  }
}