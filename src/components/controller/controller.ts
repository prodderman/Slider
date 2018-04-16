import IEvent from './../observer/observer';
import Model from './../model/model';
import View from './../view/view';

import { IViewEvents } from '../view/namespace';
import { IModelEvents } from '../model/namespace';
import { IControllerOptions } from './namespace';
import { IOptions, TCallback } from './../../namespace';

type event = MouseEvent | KeyboardEvent | TouchEvent | CustomEvent;

interface CustomEvents {
  create?: event;
  start?: event;
  slide?: event;
  end?: event;
  update?: event;
}

export default class Controller {

  private callbacks: IControllerOptions = {};

  private customEvents: CustomEvents = {};

  constructor(private model: Model, private view: View, callbacks: IControllerOptions) {
    this.init(callbacks);
  }

  // ================= public methods ===================

  public init(callbacks: IControllerOptions, isUpdated?: boolean): void {
    this.initCallbacks(callbacks);
    this.attachViewEvents();
    this.attachModelEvents();

    if (isUpdated) {
      this.customEvents.update = this.createSliderEvent('vanillaupdate');
      this.callFunction(this.customEvents.update, {
        from: this.model.data.from,
        to: this.model.data.to
      }, this.callbacks.onUpdate);
      this.view.rootObject.dispatchEvent(this.customEvents.update);
    } else {
      this.customEvents.create =  this.createSliderEvent('vanillacreate');
      this.callFunction(this.customEvents.create, {
        from: this.model.data.from,
        to: this.model.data.to
      }, this.callbacks.onCreate);
      this.view.rootObject.dispatchEvent(this.customEvents.create);
    }

    this.view.calcFrom(this.convertToPercent(this.model.data.from));
    this.view.calcTo(this.convertToPercent(this.model.data.to));
  }

  // ================= private methods ===================

  private initCallbacks(callbacks: IControllerOptions) {
    if (callbacks.onCreate) {
      this.callbacks.onCreate = callbacks.onCreate;
    }
    if (callbacks.onStart) {
      this.callbacks.onStart = callbacks.onStart;
    }
    if (callbacks.onSlide) {
      this.callbacks.onSlide = callbacks.onSlide;
    }
    if (callbacks.onEnd) {
      this.callbacks.onEnd = callbacks.onEnd;
    }
    if (callbacks.onUpdate) {
      this.callbacks.onUpdate = callbacks.onUpdate;
    }
  }

  private attachViewEvents() {
    this.view.events.fromChanged.attach((handle: HTMLSpanElement, realValue: number) => {
      this.customEvents.slide =  this.createSliderEvent('vanillaslide');
      this.model.calcFromWithStep(this.convertToReal(realValue));
    });

    this.view.events.toChanged.attach((handle: HTMLSpanElement, realValue: number) => {
      this.customEvents.slide = this.createSliderEvent('vanillaslide');
      this.model.calcToWithStep(this.convertToReal(realValue));
    });

    this.view.events.slideStart.attach((handle: HTMLSpanElement) => {
      this.customEvents.start =  this.createSliderEvent('vanillastart');
      this.callFunction(this.customEvents.start, {
        handle: handle,
        from: this.model.data.from,
        to: this.model.data.to
      }, this.callbacks.onStart);
      handle.dispatchEvent(this.customEvents.start);
    });

    this.view.events.slideEnd.attach((handle: HTMLSpanElement) => {
      this.customEvents.end = this.createSliderEvent('vanillaend');
      this.callFunction(this.customEvents.end, {
        handle: handle,
        from: this.model.data.from,
        to: this.model.data.to
      }, this.callbacks.onEnd);
      handle.dispatchEvent(this.customEvents.end);
    });
  }

  private attachModelEvents() {
    this.model.events.fromChanged.attach((fromValue: number) => {
      this.view.calcFrom(this.convertToPercent(fromValue));

      if (!this.customEvents.slide) { return; }

      this.callFunction(this.customEvents.slide, {
        handle: this.view.nodesData.from,
        from: this.model.data.from,
        to: this.model.data.to
      }, this.callbacks.onSlide);

      this.view.nodesData.from.dispatchEvent(this.customEvents.slide);
    });

    this.model.events.toChanged.attach((toValue: number) => {
      this.view.calcTo(this.convertToPercent(toValue));

      if (!this.customEvents.slide) { return; }

      this.callFunction(this.customEvents.slide, {
        handle: this.view.nodesData.to,
        from: this.model.data.from,
        to: this.model.data.to
      }, this.callbacks.onSlide);

      (<HTMLSpanElement>this.view.nodesData.to).dispatchEvent(this.customEvents.slide);
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

    if (this.view.data.orientation === 'horizontal') {
      const width = viewNodes.track.clientWidth;
      return Number( ((pixels * range / width) + modelData.min).toFixed(10) );
    } else {
      const height = viewNodes.track.clientHeight;
      return Number( (((height - pixels) * range / height) + modelData.min).toFixed(10) );
    }
  }

  private callFunction(event: event, data = {}, callback?: TCallback): void {
    if (callback && typeof callback === 'function') {
      callback(event, data);
    }
  }

  private createSliderEvent(eventName: string) {
    return new CustomEvent(eventName, {
      detail: {
        from: this.model.data.from,
        to: this.model.data.to,
        target: this.view.rootObject
      },
      bubbles: true,
      cancelable: true
    });
  }
}