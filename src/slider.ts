import Model from './components/model/model';
import View from './components/view/view';
import Controller from './components/controller/controller';

import {IModelOptions} from './components/model/namespace';
import {IViewOptions} from './components/view/namespace';

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
  onFrom?: Function;
  onTo?: Function;
  onSlide?: Function;
  onEnd?: Function;
  onUpdate?: Function;
}

export default class VanillaSlider {

  private modelOptions: IModelOptions = {};
  private viewOptions: IViewOptions = {};
  private root: HTMLDivElement | HTMLSpanElement;

  private view: View;
  private model: Model;
  private controller: Controller;

  private tools = {
    set: this.set.bind(this)
  }

  private static instance: Array<VanillaSlider> = [];
 
  constructor(rootObject: HTMLElement | HTMLCollection | string, options: IOptions = {}) {
    if (this.setRoot(rootObject)) {
      this.init(options);
    }
  }

  static for(node: HTMLElement | HTMLCollection | string) {
    const n = VanillaSlider.checkNode(node);
    for (let ins of VanillaSlider.instance) {
      if (n && n === ins.root) {
        return ins.tools;
      }
    }
  }

  private set(options: IOptions) {
    if (this.setOptions(options)) {
      this.model.init(this.modelOptions, true);
      this.view.init(this.viewOptions, true);
    }
  }

  private init(options: IOptions) {
    this.setOptions(options);
    this.model = new Model(this.modelOptions);
    this.view = new View(this.root, this.model, this.viewOptions);
    this.controller = new Controller(this.model, this.view);
  }

  private setOptions(options: IOptions) {
    const o = options;
    const t = View.types;
    const d = View.orientations;
    let updated = false;

    if (o.type && o.type in t) {
      this.viewOptions.type = o.type;
      this.modelOptions.type = o.type === t.double ? true : false;
      updated = true;
    }
    if (o.orientation && o.orientation in d) {
      this.viewOptions.orientation = o.orientation;
      updated = true;
    }
    if (o.min && !Number.isNaN(Number(o.min))) {
      this.modelOptions.min = Number(o.min);
      updated = true;
    }
    if (o.max && !Number.isNaN(Number(o.max))) {
      this.modelOptions.max = Number(o.max);
      updated = true;
    }
    if (o.from && !Number.isNaN(Number(o.from))) {
      this.modelOptions.from = Number(o.from);
      updated = true;
    }
    if (o.to && !Number.isNaN(Number(o.to))) {
      this.modelOptions.to = Number(o.to);
      updated = true;
    }
    if (o.step && !Number.isNaN(Number(o.step))) {
      this.modelOptions.step = Number(o.step);
      updated = true;
    }

    return updated;
  }

  private setRoot(root: HTMLElement | HTMLCollection | string) {
    const r = VanillaSlider.checkNode(root);

    if (r) {
      this.root = r as HTMLDivElement | HTMLSpanElement;
    } 
    else{
      throw "Invalid node type, expected 'div'";
    }
    
    VanillaSlider.instance.push(this);
    return true;
  }

  private static checkNode(node: HTMLElement | HTMLCollection | string) {
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