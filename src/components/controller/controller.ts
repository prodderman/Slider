import IEvent from './../observer/observer';
import Model from './../model/model';
import View from './../view/view';

import { IViewEvents } from '../view/namespace';
import { IModelEvents } from '../model/namespace';
import { IControllerOptions } from './namespace';

type event = MouseEvent | KeyboardEvent | TouchEvent | CustomEvent;

interface customEvents {
  create?: CustomEvent,
  start?: MouseEvent,
  slide?: MouseEvent,
  end?: MouseEvent,
  update?: CustomEvent
}

export default class Controller {

  private callbacks: IControllerOptions = {};

  private customEvents: customEvents = {};

  constructor(private model: Model, private view: View, callbacks: IControllerOptions) {
    this.init(callbacks);
  }

  // ================= public methods ===================

  public init(callbacks: IControllerOptions,isUpdate?: boolean) {
    const m = this.model;
    const v = this.view;
    const c = this.callbacks;
    const e = this.customEvents;
    const modelE = this.model.events;
    const viewE = this.view.events;
    if (callbacks.onCreate) {
      c.onCreate = callbacks.onCreate;
    }
    if (callbacks.onStart) {
      c.onStart = callbacks.onStart;
    }
    if (callbacks.onSlide) {
      c.onSlide = callbacks.onSlide;
    }
    if (callbacks.onEnd) {
      c.onEnd = callbacks.onEnd;
    }
    if (callbacks.onUpdate) {
      c.onUpdate = callbacks.onUpdate;
    }
    
    if (isUpdate) {
      e.update = new CustomEvent('vanillaupdate', {
        detail: {
          target: v.rootObject
        },
        bubbles: true,
        cancelable: true
      });
      this.callFunction(e.update, {
        from: m.data.from,
        to: m.data.to
      }, c.onUpdate);
      v.rootObject.dispatchEvent(e.update);
    } else {
      e.create = new CustomEvent('vanillacreate', {
        detail: {
          target: v.rootObject
        },
        bubbles: true,
        cancelable: true
      });
      v.rootObject.dispatchEvent(e.create);
      this.callFunction(e.create, {
        from: m.data.from,
        to: m.data.to
      }, c.onCreate);
    }

    viewE.fromChanged.attach((handle: HTMLSpanElement,value: number) => {
      e.slide = new MouseEvent('vanillaslide', {
        bubbles: true,
        cancelable: true
      });
      m.calcFromWithStep(this.convertToReal(value));
    });

    viewE.toChanged.attach((handle: HTMLSpanElement ,value: number) => {
      e.slide = new MouseEvent('vanillaslide', {
        bubbles: true,
        cancelable: true
      });
      m.calcToWithStep(this.convertToReal(value));
    });


    viewE.slideStart.attach((handle: HTMLSpanElement) => {
      let value;
      e.start = new MouseEvent('vanillastart', {
        bubbles: true,
        cancelable: true
      });

      this.callFunction(e.start, {
        handle: handle,
        from: m.data.from,
        to: m.data.to
      }, c.onStart);
      handle.dispatchEvent(e.start);
    })

    viewE.slideEnd.attach((handle: HTMLSpanElement) => {
      let value;
      e.end = new MouseEvent('vanillaend', {
        bubbles: true,
        cancelable: true
      });


      this.callFunction(e.end, {
        handle: handle,
        from: m.data.from,
        to: m.data.to
      }, c.onEnd);
      handle.dispatchEvent(e.end);
    })

    modelE.fromChanged.attach((from: number) => {
      v.calcFrom(this.converToPercent(from));

      if (!e.slide) return;

      this.callFunction(e.slide, {
        handle: v.nodesData.from,
        from: m.data.from,
        to: m.data.to
      }, c.onSlide);

      v.nodesData.from.dispatchEvent(e.slide);
    });

    modelE.toChanged.attach((to: number) => {
      v.calcTo(this.converToPercent(to));
      
      if (!e.slide) return;

      this.callFunction(e.slide, {
        handle: v.nodesData.to,
        from: m.data.from,
        to: m.data.to
      }, c.onSlide);

      (<HTMLSpanElement>v.nodesData.to).dispatchEvent(e.slide);
    });

    this.view.calcFrom(this.converToPercent(m.data.from));
    this.view.calcTo(this.converToPercent(m.data.to));
  }

  // ================= private methods ===================

  private converToPercent(value: number) {
    const m = this.model.data;
    const range = m.max - m.min;
    return +((value - m.min) * 100 / range).toFixed(10);
  }

  private convertToReal(pixels: number) {
     const range = this.model.data.max - this.model.data.min;

    if (this.view.data.orientation === 'horizontal') {
      const width = this.view.nodesData.track.clientWidth;
      return +((pixels * range / width) + this.model.data.min).toFixed(10);
    } else {
      const height = this.view.nodesData.track.clientHeight;
      return +(((height - pixels) * range / height) + this.model.data.min).toFixed(10);
    }    
  }

  private callFunction(event: event, data = {}, callback?: Function) {

    if (callback && typeof callback === "function") {
      callback(event, data);
    }
  }
}