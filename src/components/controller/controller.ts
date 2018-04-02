import IEvent from './../observer/observer';
import Model from './../model/model';
import View from './../view/view';

import { IViewEvents } from '../view/namespace';
import { IModelEvents } from '../model/namespace';
import { IControllerOptions } from './namespace';
import { IOptions, TCallback } from './../../namespace';

type event = MouseEvent | KeyboardEvent | TouchEvent | CustomEvent;

interface CustomEvents {
  create?: CustomEvent;
  start?: MouseEvent;
  slide?: MouseEvent;
  end?: MouseEvent;
  update?: CustomEvent;
}

export default class Controller {

  private callbacks: IControllerOptions = {};

  private customEvents: CustomEvents = {};

  constructor(private model: Model, private view: View, callbacks: IControllerOptions) {
    this.init(callbacks);
  }

  // ================= public methods ===================

  public init(callbacks: IControllerOptions, isUpdate?: boolean): void {
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

    if (isUpdate) {
      this.customEvents.update = new CustomEvent('vanillaupdate', {
        detail: {
          target: this.view.rootObject
        },
        bubbles: true,
        cancelable: true
      });
      this.callFunction(this.customEvents.update, {
        from: this.model.data.from,
        to: this.model.data.to
      }, this.callbacks.onUpdate);
      this.view.rootObject.dispatchEvent(this.customEvents.update);
    } else {
      this.customEvents.create = new CustomEvent('vanillacreate', {
        detail: {
          target: this.view.rootObject
        },
        bubbles: true,
        cancelable: true
      });
      this.view.rootObject.dispatchEvent(this.customEvents.create);
      this.callFunction(this.customEvents.create, {
        from: this.model.data.from,
        to: this.model.data.to
      }, this.callbacks.onCreate);
    }

    this.view.events.fromChanged.attach((handle: HTMLSpanElement, realValue: number) => {
      this.customEvents.slide = new MouseEvent('vanillaslide', {
        bubbles: true,
        cancelable: true
      });
      this.model.calcFromWithStep(this.convertToReal(realValue));
    });

    this.view.events.toChanged.attach((handle: HTMLSpanElement, realValue: number) => {
      this.customEvents.slide = new MouseEvent('vanillaslide', {
        bubbles: true,
        cancelable: true
      });
      this.model.calcToWithStep(this.convertToReal(realValue));
    });


    this.view.events.slideStart.attach((handle: HTMLSpanElement) => {
      this.customEvents.start = new MouseEvent('vanillastart', {
        bubbles: true,
        cancelable: true
      });

      this.callFunction(this.customEvents.start, {
        handle: handle,
        from: this.model.data.from,
        to: this.model.data.to
      }, this.callbacks.onStart);
      handle.dispatchEvent(this.customEvents.start);
    });

    this.view.events.slideEnd.attach((handle: HTMLSpanElement) => {
      this.customEvents.end = new MouseEvent('vanillaend', {
        bubbles: true,
        cancelable: true
      });


      this.callFunction(this.customEvents.end, {
        handle: handle,
        from: this.model.data.from,
        to: this.model.data.to
      }, this.callbacks.onEnd);
      handle.dispatchEvent(this.customEvents.end);
    });

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

    this.view.calcFrom(this.convertToPercent(this.model.data.from));
    this.view.calcTo(this.convertToPercent(this.model.data.to));
  }

  // ================= private methods ===================

  private convertToPercent(realValue: number): number {
    const range = this.model.data.max - this.model.data.min;
    return +((realValue - this.model.data.min) * 100 / range).toFixed(10);
  }

  private convertToReal(pixels: number): number {
     const range = this.model.data.max - this.model.data.min;

    if (this.view.data.orientation === 'horizontal') {
      const width = this.view.nodesData.track.clientWidth;
      return +((pixels * range / width) + this.model.data.min).toFixed(10);
    } else {
      const height = this.view.nodesData.track.clientHeight;
      return +(((height - pixels) * range / height) + this.model.data.min).toFixed(10);
    }
  }

  private callFunction(event: event, data = {}, callback?: TCallback): void {
    if (callback && typeof callback === 'function') {
      callback(event, data);
    }
  }
}