import Model from './components/model/model';
import View from './components/view/view';
import Controller from './components/controller/controller';

import {IModelOptions} from './components/model/namespace';
import {IViewOptions} from './components/view/namespace';
import {IControllerOptions} from './components/controller/namespace';

interface IOptions {
  type?: string;
  orientation?: string;
  min?: number | string;
  max?: number | string;
  from?: number | string;
  from_fixed?: boolean | string;
  to?: number | string;
  to_fixed?: boolean | string;
  step?: number | string;

  onCreate?: Function;
  onStart?: Function;
  onSlide?: Function;
  onEnd?: Function;
  onUpdate?: Function;
}

type Selector = HTMLElement | HTMLCollection | string;

class Constructor {

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

  get data() {
    return Object.assign({}, this.model.data, this.view.data);
  }

  public set(options: IOptions) {
    if (this.setOptions(options)) {
      this.model.init(this.modelOptions, true);
      this.view.init(this.viewOptions, true);
      this.controller.init(this.controllerOptions, true);
    }
  }

  private init(options: IOptions) {
    this.setOptions(options);
    this.model = new Model(this.modelOptions);
    this.view = new View(this.root, this.viewOptions);
    this.controller = new Controller(this.model, this.view, this.controllerOptions);
  }

  private setOptions(options: IOptions) {
    const o = options;
    const t = View.types;
    const d = View.orientations;
    let updated = false;
    
    this.modelOptions = {};
    this.viewOptions = {};
    this.controllerOptions = {};

    if (o.type && o.type in t) {
      this.viewOptions.type = o.type;
      this.modelOptions.type = o.type === t.double ? true : false;
      updated = true;
    }
    if (o.orientation && o.orientation in d) {
      this.viewOptions.orientation = o.orientation;
      updated = true;
    }
    if (o.min !== undefined && !Number.isNaN(Number(o.min))) {
      this.modelOptions.min = Number(o.min);
      updated = true;
    }
    if (o.max !== undefined && !Number.isNaN(Number(o.max))) {
      this.modelOptions.max = Number(o.max);
      updated = true;
    }
    if (o.from !== undefined && !Number.isNaN(Number(o.from))) {
      this.modelOptions.from = Number(o.from);
      updated = true;
    }
    if (o.to !== undefined && !Number.isNaN(Number(o.to))) {
      this.modelOptions.to = Number(o.to);
      updated = true;
    }
    if (o.from_fixed !== undefined) {
      const r = (/true/i).test(o.from_fixed.toString());
      this.modelOptions.from_fixed = r;
      this.viewOptions.from_fixed = r;
      updated = true;
    }
    if (o.to_fixed !== undefined) {
      const r = (/true/i).test(o.to_fixed.toString());
      this.modelOptions.to_fixed = r;
      this.viewOptions.to_fixed = r;
      updated = true;
    }
    if (o.step !== undefined && !Number.isNaN(Number(o.step))) {
      this.modelOptions.step = Number(o.step);
      updated = true;
    }

    this.controllerOptions.onCreate = o.onCreate;
    this.controllerOptions.onStart = o.onStart;
    this.controllerOptions.onSlide = o.onSlide;
    this.controllerOptions.onEnd = o.onEnd;
    this.controllerOptions.onUpdate = o.onUpdate;
    return updated;
  }

  private setRoot(root: Selector) {
    const r = Constructor.checkNode(root);

    if (r) {
      this.root = r as HTMLDivElement | HTMLSpanElement;
    } 
    else{
      throw "Invalid node type, expected 'div'";
    }
    return true;
  }

  static checkNode(node: Selector) {
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
  
  private static instances: Array<Constructor> = [];
  
  constructor(root: Selector, options: IOptions = {}) {
    const instance = new Constructor(root, options, this);
    this.set = instance.set.bind(instance);
    this.data = () => instance.data;
    VanillaSlider.instances.push(instance);
  }

  static for(node: Selector) {
    const n = Constructor.checkNode(node);
    for (let ins of VanillaSlider.instances) {
      if (n && n === ins.root) {
        return ins.wrap;
      }
    }
  }
}
