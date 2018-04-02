import Model from './components/model/model';
import View from './components/view/view';
import Controller from './components/controller/controller';

import { IModelOptions } from './components/model/namespace';
import { IViewOptions, SliderTypes, Orient } from './components/view/namespace';
import { IControllerOptions } from './components/controller/namespace';
import { IOptions, Selector } from 'namespace';

class SliderConstructor {

  public root: HTMLDivElement | HTMLSpanElement;

  private modelOptions: IModelOptions;
  private viewOptions: IViewOptions;
  private controllerOptions: IControllerOptions;

  private view: View;
  private model: Model;
  private controller: Controller;

  constructor(rootObject: Selector, options: IOptions = {}, public wrap: VanillaSlider) {
    if (this.setRoot(rootObject)) {
      this.init(options);
    }
  }

  get data(): IOptions {
    return Object.assign({}, this.model.data, this.view.data);
  }

  public set(options: IOptions): void {
    this.setOptions(options);
    this.model.init(this.modelOptions);
    this.view.init(this.viewOptions);
    this.controller.init(this.controllerOptions, true);
  }

  private init(options: IOptions): void {
    this.setOptions(options);
    this.model = new Model(this.modelOptions);
    this.view = new View(this.root, this.viewOptions);
    this.controller = new Controller(this.model, this.view, this.controllerOptions);
  }

  private setOptions(options: IOptions): void {
    this.modelOptions = {};
    this.viewOptions = {};
    this.controllerOptions = {};

    if (options.type && ['single', 'min', 'max', 'double'].includes(options.type)) {
      this.viewOptions.type = <SliderTypes>options.type;
      this.modelOptions.type = options.type === 'double' ? true : false;
    }
    if (options.orientation && ['horizontal', 'vertical'].includes(options.orientation)) {
      this.viewOptions.orientation = <Orient>options.orientation;
    }
    if (!this.isUndefined(options.min) && !Number.isNaN(Number(options.min))) {
      this.modelOptions.min = Number(options.min);
    }
    if (!this.isUndefined(options.max) && !Number.isNaN(Number(options.max))) {
      this.modelOptions.max = Number(options.max);
    }
    if (!this.isUndefined(options.from) && !Number.isNaN(Number(options.from))) {
      this.modelOptions.from = Number(options.from);
    }
    if (!this.isUndefined(options.to) && !Number.isNaN(Number(options.to))) {
      this.modelOptions.to = Number(options.to);
    }
    if (!this.isUndefined(options.fromFixed)) {
      const check = (/true/i).test((<boolean | string>options.fromFixed).toString());
      this.modelOptions.fromFixed = check;
      this.viewOptions.fromFixed = check;
    }
    if (!this.isUndefined(options.toFixed)) {
      const check = (/true/i).test((<boolean | string>options.toFixed).toString());
      this.modelOptions.toFixed = check;
      this.viewOptions.toFixed = check;
    }
    if (!this.isUndefined(options.step) && !Number.isNaN(Number(options.step))) {
      this.modelOptions.step = Number(options.step);
    }

    this.controllerOptions.onCreate = options.onCreate;
    this.controllerOptions.onStart = options.onStart;
    this.controllerOptions.onSlide = options.onSlide;
    this.controllerOptions.onEnd = options.onEnd;
    this.controllerOptions.onUpdate = options.onUpdate;
  }

  private setRoot(root: Selector): boolean {
    const check = SliderConstructor.checkNode(root);

    if (check) {
      this.root = check as HTMLDivElement | HTMLSpanElement;
    }
    else {
      throw 'Invalid node type, expected \'div\'';
    }
    return true;
  }

  private isUndefined(value: any): boolean {
    return value === undefined;
  }

  static checkNode(node: Selector): HTMLDivElement | HTMLSpanElement | undefined {
    if (node instanceof HTMLDivElement || node instanceof HTMLSpanElement) {
      return node;
    } else if (node instanceof HTMLCollection && node[0] instanceof HTMLDivElement) {
      return <HTMLDivElement | HTMLSpanElement>node[0];
    } else if (typeof node === 'string') {
      const t = document.querySelector(node);
      if (t instanceof HTMLDivElement || t instanceof HTMLSpanElement) {
        return t;
      }
    }
  }
}

export default class VanillaSlider {
  set: (options: IOptions) => void;
  data: () => IOptions;

  private static instances: Array<SliderConstructor> = [];

  constructor(root: Selector, options: IOptions = {}) {
    const instance = new SliderConstructor(root, options, this);
    this.set = instance.set.bind(instance);
    this.data = () => instance.data;
    VanillaSlider.instances.push(instance);
  }

  static for(node: Selector) {
    const n = SliderConstructor.checkNode(node);
    for (let ins of VanillaSlider.instances) {
      if (n && n === ins.root) {
        return ins.wrap;
      }
    }
  }
}
