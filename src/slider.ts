import Model from './components/model/model';
import View from './components/view/view';
import Controller from './components/controller/controller';

interface IOptions {
  type?: string;
  orientation?: string;
  min?: number | string;
  max?: number | string;
  from?: number | string;
  to?: number | string;
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


  constructor(rootObject: HTMLElement | HTMLCollection | string, options: IOptions = {}) {
    const model = new Model({type: true, min: 0, max: 100, from: -50, to: 80, step: 1});
    const view = new View(rootObject, model, {type: 'double'});
    const controller = new Controller(model, view);
  }

  init() {

  }

  set() {
    
  }
}