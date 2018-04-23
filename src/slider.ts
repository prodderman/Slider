import Model from './components/model/model';
import View from './components/view/view';
import Controller from './components/controller/controller';

import { IModelOptions } from './components/model/namespace';
import { IViewOptions, TType, TOrientation  } from './components/view/namespace';
import { IControllerOptions } from './components/controller/namespace';
import { IOptions, TNode } from 'namespace';

type TRoot = HTMLDivElement | HTMLSpanElement;

class SliderConstructor {

  public root: TRoot;

  private modelOptions: IModelOptions;
  private viewOptions: IViewOptions;
  private controllerOptions: IControllerOptions;

  private view: View;
  private model: Model;
  private controller: Controller;

  constructor(rootObject: TNode, options: IOptions = {}, public context: VanillaSlider) {
    this.root = SliderConstructor.getValidateNode(rootObject);
    this.init(options);
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
      this.viewOptions.type = <TType>options.type;
      this.modelOptions.type = options.type === 'double' ? true : false;
    }
    if (options.orientation && ['vertical', 'horizontal'].includes(options.orientation)) {
      this.viewOptions.orientation = <TOrientation>options.orientation;
    }
    this.setModelOption('min', options.min);
    this.setModelOption('max', options.max);
    this.setModelOption('from', options.from);
    this.setModelOption('to', options.to);
    this.setModelOption('step', options.step);

    if (!this.isUndefined(options.fromFixed)) {
      const fromFixed = (/true/i).test((<boolean | string>options.fromFixed).toString());
      this.modelOptions.fromFixed = fromFixed;
      this.viewOptions.fromFixed = fromFixed;
    }
    if (!this.isUndefined(options.toFixed)) {
      const toFixed = (/true/i).test((<boolean | string>options.toFixed).toString());
      this.modelOptions.toFixed = toFixed;
      this.viewOptions.toFixed = toFixed;
    }

    this.controllerOptions.onCreate = options.onCreate;
    this.controllerOptions.onStart = options.onStart;
    this.controllerOptions.onSlide = options.onSlide;
    this.controllerOptions.onEnd = options.onEnd;
    this.controllerOptions.onUpdate = options.onUpdate;
  }

  private setModelOption(optionName: string, value?: string | number) {
    if (!this.isUndefined(value) && !Number.isNaN(Number(value))) {
      this.modelOptions[optionName] = Number(value);
    }
  }

  private isUndefined(value: any): boolean {
    return value === undefined;
  }

  static getValidateNode(node: TNode): TRoot {
    if ((node instanceof HTMLDivElement) || (node instanceof HTMLSpanElement)) {
      return <TRoot>node;
    } else if ((node instanceof HTMLCollection) && (node[0] instanceof HTMLDivElement)) {
      return <TRoot>node[0];
    } else if (typeof node === 'string') {
      const t = document.querySelector(node);
      if ((t instanceof HTMLDivElement) || (t instanceof HTMLSpanElement)) {
        return t;
      }
    }
    throw 'Invalid node type, expected \'div\' or \'span\'';
  }
}

export default class VanillaSlider {
  set: (options: IOptions) => void;
  data: IOptions;

  private static instances: Array<SliderConstructor> = [];

  constructor(root: TNode, options: IOptions = {}) {
    const instance = new SliderConstructor(root, options, this);
    this.set = instance.set.bind(instance);
    this.data = instance.data;
    VanillaSlider.instances.push(instance);
  }

  static getInstance(node: TNode) {
    const n = SliderConstructor.getValidateNode(node);
    for (let ins of VanillaSlider.instances) {
      if (n && n === ins.root) {
        return ins.context;
      }
    }
  }
}
