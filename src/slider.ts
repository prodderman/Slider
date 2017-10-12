import Model from './components/model/model';
import View from './components/view/view';
import Controller from './components/controller/controller';

export default class Slider {
    constructor(rootObject: HTMLElement, options = {}) {
      const model = new Model({
        range: true,
        min: 20,
        max: 50,
        values: [10, 25]
      });
    }
}