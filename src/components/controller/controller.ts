import IEvent from './../observer/observer';
import Model from './../model/model';
import View from './../view/view';

import { IViewEvents } from '../view/namespace';

export default class Controller {
  constructor(private model: Model, private view: View) {
    view.events.fromChanged.attach((value: number) => {
      model.calcFromWithStep(value);
    });

    view.events.toChanged.attach((value: number) => {
      model.calcToWithStep(value);
    })
  }
}