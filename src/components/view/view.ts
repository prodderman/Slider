import IEvent from './../observer/observer';
import { IModel as Model, IModelEvents, IModelOptions } from '../model/namespace';
import { IViewOptions, IViewEvents } from './namespace';

interface IMandatoryOptions extends IViewOptions {
  type: string;
  orientation: string;
}

export default class View {
  private triggers: IViewEvents  = {
    sliderPress: new IEvent(),
    sliderUp: new IEvent()
  }

  private options: IMandatoryOptions = {
    type: "single",
    orientation: "horizontal",
  }
  
  constructor(private _root: HTMLDivElement, private _model: Model, viewOptions: IViewOptions = {}) {
    this.init(viewOptions);
  }

  // accessors

  get data(): IMandatoryOptions {
    return this.options;
  }

  get events(): IViewEvents {
    return this.events;
  }

  get root() {
    return this._root;
  }

  // public methods

  public init(viewOptions: IViewOptions) {

  }

  public chooseHandle(percent: number) {

  }

  // private methods

  private template() {

  }
}