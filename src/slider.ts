import Model from './components/model/model';
import View from './components/view/view';
import Controller from './components/controller/controller';

import { IOptions as IModelOptions } from './components/model/namespace';
import { initialOptions as initialModel } from './components/model/initial';
import { IOptions as IViewOptions, TOrientation, TRoot, TSliderType } from './components/view/namespace';
import { initialOptions as initialView } from './components/view/initial';
import { ICallbacks, TCallback } from './components/controller/namespace';
import { initialOptions as initialController } from './components/controller/initial';
import { IOptions, TNode } from 'namespace';

class SliderConstructor {
  private modelOptions: IModelOptions = { ...initialModel };
  private viewOptions: IViewOptions = { ...initialView };
  private controllerCallbacks: ICallbacks = { ...initialController };

  private view!: View;
  private model!: Model;
  private controller!: Controller;

  constructor(private root: TRoot, options: IOptions = {}) {
    this.init(options);
  }

  get data(): IOptions {
    return { ...this.model.data, ...this.view.data };
  }

  public update(options: IOptions): void {
    this.setOptions(options);
    this.model.updateState(this.modelOptions);
    this.view.updateState(this.viewOptions);
    this.controller.updateClientsCallbacks(this.controllerCallbacks);
  }

  private init(options: IOptions): void {
    this.model = new Model();
    this.view = new View(this.root);
    this.setOptions(options);
    this.model.updateState(this.modelOptions);
    this.view.updateState(this.viewOptions);
    this.controller = new Controller(this.model, this.view, this.controllerCallbacks);
  }

  private setOptions(options: IOptions): void {
    this.modelOptions = { ...this.model.data };
    this.viewOptions = { ...this.view.data };

    if (options.type && options.type in TSliderType) {
      this.viewOptions.type = options.type;
      this.modelOptions.type = options.type === TSliderType.double ? true : false;
    }
    if (options.orientation && options.orientation in TOrientation) {
      this.viewOptions.orientation = options.orientation;
    }
    this.setNumberOption('min', options.min);
    this.setNumberOption('max', options.max);
    this.setNumberOption('from', options.from);
    this.setNumberOption('to', options.to);
    this.setNumberOption('step', options.step);
    this.setFixedOption('fromFixed', options.fromFixed);
    this.setFixedOption('toFixed', options.toFixed);
    this.setCallback('onCreate', options.onCreate);
    this.setCallback('onSlideStart', options.onSlideStart);
    this.setCallback('onSlide', options.onSlide);
    this.setCallback('onSlideFinish', options.onSlideFinish);
    this.setCallback('onUpdate', options.onUpdate);
  }

  private setNumberOption(optionName: keyof IModelOptions, value?: string | number) {
    if (value !== void(0) && !Number.isNaN(Number(value))) {
      this.modelOptions[optionName] = Number(value);
    }
  }

  private setFixedOption(optionName: keyof IModelOptions & keyof IViewOptions & ('fromFixed' | 'toFixed'), value?: string | boolean) {
    if (value !== void(0)) {
      this.modelOptions[optionName] = JSON.parse(value.toString());
      this.viewOptions[optionName] = JSON.parse(value.toString());
    }
  }

  private setCallback(optionName: keyof ICallbacks, callback?: TCallback) {
    if (callback !== void(0) && typeof callback === 'function') {
      this.controllerCallbacks[optionName] = callback;
    }
  }
}

export default class VanillaSlider {
  public setOptions!: (options: IOptions) => void;
  public data!: IOptions;

  private static instances: Map<TRoot, VanillaSlider> = new Map();

  constructor(node: TNode, options: IOptions = {}) {
    const validatedNode = VanillaSlider.getValidateNode(node);
    if (VanillaSlider.instances.has(validatedNode)) {
      return VanillaSlider.instances.get(validatedNode) as VanillaSlider;
    }
    const slider = new SliderConstructor(validatedNode, options);
    this.setOptions = slider.update.bind(slider);
    this.data = slider.data;
    VanillaSlider.instances.set(validatedNode, this);
  }

  public static getInstance(node: HTMLElement): VanillaSlider | undefined {
    if (!this.isDivOrSpan(node)) { return undefined; }
    return VanillaSlider.instances.get(node);
  }

  private static getValidateNode(node: TNode): TRoot {
    const element = typeof node === 'string' ? document.querySelector(node) : node;

    if (this.isDivOrSpan(element)) { return <TRoot>element; }
    if ((element instanceof HTMLCollection) && (this.isDivOrSpan(element[0]))) {
      return <TRoot>element[0];
    }
    throw 'Invalid node type, expected \'div\' or \'span\'';
  }

  private static isDivOrSpan(node: TNode): boolean {
    return (node instanceof HTMLDivElement) || (node instanceof HTMLSpanElement);
  }
}
